const API_BASE_URL = 'http://localhost:5000';

class ApiService {
  // Verificar se o token é válido (não expirou)
  isTokenValid() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      // Decodificar o payload do JWT (segunda parte)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Verificar se ainda não expirou
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return false;
    }
  }

  // Método para fazer requisições
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Adicionar token se existir
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      console.log('🔄 API Request:', {
        method: config.method || 'GET',
        url: url,
        headers: config.headers,
        hasToken: !!config.headers.Authorization
      });

      const response = await fetch(url, config);
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('🚨 Erro ao fazer parse JSON:', jsonError);
        throw new Error(`Resposta inválida do servidor: ${response.status} ${response.statusText}`);
      }

      console.log('📡 API Response:', {
        status: response.status,
        ok: response.ok,
        data: data
      });

      if (!response.ok) {
        // Se token expirou, limpar localStorage e redirecionar
        if (response.status === 401 && (data.error === 'Token inválido.' || data.message === 'Token inválido.')) {
          console.warn('🔒 Token expirado, fazendo logout...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
          return;
        }
        
        const errorMessage = data.error || data.message || `Erro ${response.status}: ${response.statusText}`;
        console.error('🚨 API Error:', {
          status: response.status,
          error: errorMessage,
          data: data,
          url: url
        });
        
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('🚨 Request Error:', {
        error: error,
        message: error.message,
        url: url,
        config: config
      });
      throw error;
    }
  }

  // Login
  async login(email, senha) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
  }

  // Registro
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Upload de foto
  async uploadFoto(file) {
    const formData = new FormData();
    formData.append('foto', file);

    return this.request('/upload/foto', {
      method: 'POST',
      headers: {}, // Remove Content-Type para multipart/form-data
      body: formData,
    });
  }

  // Buscar usuário por ID
  async getUserById(id) {
    return this.request(`/usuarios/${id}`);
  }

  // Atualizar usuário
  async updateUser(id, userData) {
    return this.request(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Buscar todos os livros
  async getBooks(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/livros?${params}`);
  }

  // Buscar livro por ID
  async getBookById(id) {
    return this.request(`/livros/${id}`);
  }

  // Favoritos do usuário
  async getFavorites() {
    return this.request('/favoritos');
  }

  // Adicionar aos favoritos
  async addFavorite(livroId, status) {
    return this.request('/favoritos', {
      method: 'POST',
      body: JSON.stringify({ livroId, status }),
    });
  }

  // Buscar perfil do usuário
  async getUserProfile(id) {
    return this.request(`/users/${id}`);
  }

  // Atualizar perfil do usuário
  async updateUserProfile(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Buscar livros do escritor (para escritores)
  async getAuthorBooks(autorId) {
    return this.request(`/livros/autor/${autorId}`);
  }

  // Adicionar novo livro (para escritores)
  async createBook(bookData) {
    return this.request('/livros', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  }

  // Atualizar livro (para escritores)
  async updateBook(id, bookData) {
    return this.request(`/livros/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
  }

  // Deletar livro (para escritores)
  async deleteBook(id) {
    return this.request(`/livros/${id}`, {
      method: 'DELETE',
    });
  }

  // Upload de foto de perfil
  async uploadProfilePhoto(formData) {
    const token = localStorage.getItem('token');
    return fetch(`${API_BASE_URL}/users/upload-photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }).then(response => response.json());
  }

  // ========================================
  // 🎯 SISTEMA DE SEGUIDORES - ESTILO INSTAGRAM
  // ========================================

  // Seguir um escritor
  async seguirEscritor(escritorId) {
    return this.request(`/seguidores/seguir/${escritorId}`, {
      method: 'POST',
    });
  }

  // Deixar de seguir um escritor
  async deixarDeSeguirEscritor(escritorId) {
    return this.request(`/seguidores/deixar-de-seguir/${escritorId}`, {
      method: 'DELETE',
    });
  }

  // Meus escritores seguindo
  async getMeusEscritores() {
    return this.request('/seguidores/meus-escritores');
  }

  // Verificar se sigo um escritor
  async verificarSeguindo(escritorId) {
    return this.request(`/seguidores/verificar/${escritorId}`);
  }

  // Minhas estatísticas
  async getMinhasEstatisticas() {
    return this.request('/seguidores/minhas-estatisticas');
  }

  // Seguidores de um escritor (público)
  async getSeguidoresEscritor(escritorId) {
    return this.request(`/seguidores/escritor/${escritorId}/seguidores`);
  }

  // Ranking de escritores mais seguidos (público)
  async getRankingEscritores(limite = 10) {
    return this.request(`/seguidores/ranking?limite=${limite}`);
  }

  // Escritores que um usuário segue (público)
  async getEscritoresSeguindo(usuarioId) {
    return this.request(`/seguidores/usuario/${usuarioId}/seguindo`);
  }

  // Estatísticas de um usuário (público)
  async getEstatisticasUsuario(usuarioId) {
    return this.request(`/seguidores/usuario/${usuarioId}/estatisticas`);
  }
}

const apiService = new ApiService();
export default apiService;
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
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Se token expirou, limpar localStorage e redirecionar
        if (response.status === 401 && data.error === 'Token inválido.') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
          return;
        }
        throw new Error(data.error || `Erro ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
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
}

const apiService = new ApiService();
export default apiService;
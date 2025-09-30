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
    try {
      // Tentar endpoint específico primeiro
      console.log(`🎯 Tentando endpoint específico /livros/${id}`);
      const result = await this.request(`/livros/${id}`);
      console.log('✅ Endpoint específico funcionou:', result);
      return result;
    } catch (error) {
      // Fallback: buscar todos e filtrar (método confiável)
      console.log('🔄 getBookById fallback: buscando todos os livros...', error.message);
      const response = await this.getBooks();
      console.log('📦 Resposta getBooks completa:', response);
      
      const livros = response.livros || response || [];
      console.log(`📚 Total de livros retornados: ${livros.length}`);
      console.log('🔍 IDs dos livros disponíveis:', livros.map(l => l.id).slice(0, 20)); // Primeiros 20 IDs
      
      const targetId = parseInt(id);
      console.log(`🎯 Procurando livro com ID: ${targetId}`);
      
      const livro = livros.find(l => {
        const livroId = parseInt(l.id);
        const match = livroId === targetId;
        if (match) {
          console.log(`✅ ENCONTRADO! Livro ${livroId}: ${l.titulo}`);
        }
        return match;
      });
      
      if (livro) {
        console.log('✅ Livro encontrado via fallback:', livro.titulo);
        return { livro }; // Formato consistente com endpoint específico
      } else {
        console.log(`❌ Livro ${targetId} NÃO encontrado na lista de ${livros.length} livros`);
        console.log('🔍 Verificando se existe algum livro com ID similar:', 
          livros.filter(l => String(l.id).includes(String(id))).map(l => ({id: l.id, titulo: l.titulo}))
        );
        throw new Error(`Livro com ID ${id} não encontrado`);
      }
    }
  }

  // Favoritos do usuário
  async getFavorites() {
    try {
      return await this.request('/favoritos');
    } catch (error) {
      // Fallback com dados de exemplo para demonstração
      console.warn('Endpoint de favoritos não disponível, retornando dados de exemplo');
      return [
        {
          id: 1,
          livro: {
            id: 1,
            titulo: "Dom Casmurro",
            autor: { nome: "Machado de Assis" },
            genero: "Romance",
            anoLancamento: 1899,
            descricao: "Romance clássico da literatura brasileira que narra a história de Bentinho e Capitu.",
            numeroPaginas: 256,
            imagem: null
          },
          statusLeitura: "JA_LI",
          progresso: 100
        },
        {
          id: 2,
          livro: {
            id: 2,
            titulo: "O Cortiço",
            autor: { nome: "Aluísio Azevedo" },
            genero: "Naturalismo",
            anoLancamento: 1890,
            descricao: "Obra naturalista que retrata a vida em um cortiço no Rio de Janeiro.",
            numeroPaginas: 304,
            imagem: null
          },
          statusLeitura: "LENDO",
          progresso: 45
        },
        {
          id: 3,
          livro: {
            id: 3,
            titulo: "Iracema",
            autor: { nome: "José de Alencar" },
            genero: "Romance",
            anoLancamento: 1865,
            descricao: "Romance indianista que conta a lenda da fundação do Ceará.",
            numeroPaginas: 128,
            imagem: null
          },
          statusLeitura: "QUERO_LER",
          progresso: 0
        }
      ];
    }
  }

  // Adicionar aos favoritos
  async addFavorite(livroId, status) {
    return this.request('/favoritos', {
      method: 'POST',
      body: JSON.stringify({ livroId, status }),
    });
  }

  // Remover dos favoritos
  async removeFavorite(livroId) {
    return this.request(`/favoritos/${livroId}`, {
      method: 'DELETE',
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

  // ===== FAVORITOS COM STATUS DE LEITURA =====
  
  // Buscar favoritos com status de leitura
  async getMeusFavoritos(filtros = {}) {
    const params = new URLSearchParams(filtros);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/favoritos/meus/favoritos${queryString}`);
  }

  // Atualizar status de leitura de um favorito
  async atualizarStatusLeitura(livroId, dados) {
    return this.request(`/favoritos/status/${livroId}`, {
      method: 'PATCH',
      body: JSON.stringify(dados)
    });
  }

  // ===== CRONOGRAMA DE LEITURA =====
  
  // Buscar cronograma do usuário
  async getMeuCronograma(filtros = {}) {
    const params = new URLSearchParams(filtros);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/cronograma/meus${queryString}`);
  }

  // Criar evento no cronograma
  async criarEventoCronograma(dados) {
    return this.request('/cronograma', {
      method: 'POST',
      body: JSON.stringify(dados)
    });
  }

  // Atualizar evento do cronograma
  async atualizarEventoCronograma(eventoId, dados) {
    return this.request(`/cronograma/${eventoId}`, {
      method: 'PUT',
      body: JSON.stringify(dados)
    });
  }

  // Alternar status de conclusão do evento
  async toggleEventoCronograma(eventoId) {
    return this.request(`/cronograma/${eventoId}/toggle`, {
      method: 'PATCH'
    });
  }

  // Deletar evento do cronograma
  async deletarEventoCronograma(eventoId) {
    return this.request(`/cronograma/${eventoId}`, {
      method: 'DELETE'
    });
  }

  // Buscar favoritos do usuário com filtros
  async getMeusFavoritos(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      return await this.request(`/usuarios/favoritos?${queryParams}`);
    } catch (error) {
      // Fallback para endpoint de favoritos simples
      console.warn('Endpoint /usuarios/favoritos não encontrado, tentando /favoritos');
      return await this.getFavorites();
    }
  }
}

const apiService = new ApiService();
export default apiService;
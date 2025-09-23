const API_BASE_URL = 'http://localhost:5000';

class ApiService {
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
}

const apiService = new ApiService();
export default apiService;
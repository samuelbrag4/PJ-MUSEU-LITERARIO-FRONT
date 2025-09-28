'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import FollowingModal from '../../../components/FollowingModal';
import apiService from '../../../services/api';
import styles from './profile.module.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddBook, setShowAddBook] = useState(false);
  const [socialStats, setSocialStats] = useState({
    seguindo: 0,
    seguidores: 0,
    livrosFavoritos: 0
  });
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [newBook, setNewBook] = useState({
    titulo: '',
    anoLancamento: '',
    descricao: '',
    mediaPreco: '',
    imagem: '',
    genero: '',
    dificuldade: '',
    temAdaptacao: false,
    numeroPaginas: ''
  });

  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadSocialStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Carregar estatísticas sociais
      const meusEscritores = await apiService.getMeusEscritores();
      
      let seguidoresCount = 0;
      
      // Se for escritor, carregar número de seguidores
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser && currentUser.tipo === 'ESCRITOR') {
        try {
          const seguidoresResponse = await apiService.getSeguidoresEscritor(currentUser.id);
          seguidoresCount = seguidoresResponse.totalSeguidores || 0;
        } catch (error) {
          console.error('Erro ao carregar seguidores do escritor:', error);
        }
      }
      
      setSocialStats({
        seguindo: meusEscritores.escritores?.length || 0,
        seguidores: seguidoresCount,
        livrosFavoritos: 0 // Implementar depois se necessário
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas sociais:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      console.log('Debug - userData:', userData);
      console.log('Debug - token:', token);
      
      if (!userData || !token) {
        console.log('Debug - Sem dados de usuário ou token, redirecionando...');
        router.push('/');
        return;
      }

      // Verificar se o token ainda é válido
      if (!apiService.isTokenValid()) {
        console.log('Debug - Token expirado, redirecionando para login...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
        return;
      }

      const currentUser = JSON.parse(userData);
      console.log('Debug - currentUser:', currentUser);
      setUser(currentUser);
      setEditData(currentUser);

      // Se for escritor, carregar seus livros
      if (currentUser.tipo === 'ESCRITOR') {
        loadAuthorBooks(currentUser.id);
      }

      // Carregar estatísticas sociais para todos os usuários
      loadSocialStats();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar perfil do usuário');
    } finally {
      setLoading(false);
    }
  };

  const loadAuthorBooks = async (authorId) => {
    try {
      setLoadingBooks(true);
      const response = await apiService.getAuthorBooks(authorId);
      setBooks(response.livros || []);
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
    } finally {
      setLoadingBooks(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Debug - Tentando atualizar perfil...');
      console.log('Debug - user.id:', user.id);
      console.log('Debug - editData:', editData);
      console.log('Debug - token:', localStorage.getItem('token'));
      
      const response = await apiService.updateUserProfile(user.id, editData);
      setUser(response.usuario);
      localStorage.setItem('user', JSON.stringify(response.usuario));
      setEditing(false);
      setSuccess('Perfil atualizado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError('Erro ao atualizar perfil: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await apiService.uploadProfilePhoto(formData);
      setUser({ ...user, foto: response.fotoUrl });
      setSuccess('Foto atualizada com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setError('Erro ao atualizar foto: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const bookData = {
        ...newBook,
        autorId: user.id,
        anoLancamento: parseInt(newBook.anoLancamento),
        mediaPreco: parseFloat(newBook.mediaPreco),
        numeroPaginas: parseInt(newBook.numeroPaginas)
      };

      await apiService.createBook(bookData);
      setShowAddBook(false);
      setNewBook({
        titulo: '',
        anoLancamento: '',
        descricao: '',
        mediaPreco: '',
        imagem: '',
        genero: '',
        dificuldade: '',
        temAdaptacao: false,
        numeroPaginas: ''
      });
      loadAuthorBooks(user.id);
      setSuccess('Livro adicionado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erro ao adicionar livro:', error);
      setError('Erro ao adicionar livro: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!confirm('Tem certeza que deseja excluir este livro?')) return;

    try {
      await apiService.deleteBook(bookId);
      loadAuthorBooks(user.id);
      setSuccess('Livro excluído com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erro ao excluir livro:', error);
      setError('Erro ao excluir livro: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.loading}>Carregando perfil...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Header />

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {/* Header do Perfil */}
      <section className={styles.profileHeader}>
        <div className={styles.container}>
          <div className={styles.profileInfo}>
            <div className={styles.photoContainer}>
              {user.foto ? (
                <img src={user.foto} alt="Foto do perfil" className={styles.profilePhoto} />
              ) : (
                <div className={styles.photoPlaceholder}>
                  {user.nome.charAt(0).toUpperCase()}
                </div>
              )}
              <label className={styles.photoUpload}>
                📷
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            
            <div className={styles.userDetails}>
              <h1>{user.nome}</h1>
              <div className={styles.userName}>@{user.nomeUsuario}</div>
              <div className={styles.userType}>
                {user.tipo === 'ESCRITOR' ? '✍️ Escritor' : '👤 Usuário'}
              </div>
              <div className={styles.memberSince}>
                Membro desde {formatDate(user.entrouEm)}
              </div>
              
              {/* Estatísticas Sociais estilo Instagram */}
              <div className={styles.socialStats}>
                <div 
                  className={styles.statItem}
                  onClick={() => setShowFollowingModal(true)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className={styles.statNumber}>{socialStats.seguindo}</span>
                  <span className={styles.statLabel}>seguindo</span>
                </div>
                
                {user.tipo === 'ESCRITOR' && (
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>{socialStats.seguidores}</span>
                    <span className={styles.statLabel}>seguidores</span>
                  </div>
                )}
                
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{books.length}</span>
                  <span className={styles.statLabel}>{user.tipo === 'ESCRITOR' ? 'livros' : 'favoritos'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        {/* Informações Pessoais */}
        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>ℹ️</span>
            Informações Pessoais
          </h2>

          {!editing ? (
            <>
              <button 
                className={styles.editButton}
                onClick={() => setEditing(true)}
              >
                ✏️ Editar Informações
              </button>
              
              <div className={styles.infoDisplay}>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Nome Completo</div>
                  <div className={styles.infoValue}>{user.nome}</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Nome de Usuário</div>
                  <div className={styles.infoValue}>@{user.nomeUsuario}</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>E-mail</div>
                  <div className={styles.infoValue}>{user.email}</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Idade</div>
                  <div className={styles.infoValue}>{user.idade} anos</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Ano de Nascimento</div>
                  <div className={styles.infoValue}>{user.nascimento}</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Tipo de Conta</div>
                  <div className={styles.infoValue}>
                    {user.tipo === 'ESCRITOR' ? 'Escritor' : 'Usuário Normal'}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleEditSubmit} className={styles.editForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nome Completo</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={editData.nome || ''}
                  onChange={(e) => setEditData({...editData, nome: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nome de Usuário</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={editData.nomeUsuario || ''}
                  onChange={(e) => setEditData({...editData, nomeUsuario: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>E-mail</label>
                <input
                  type="email"
                  className={styles.formInput}
                  value={editData.email || ''}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Ano de Nascimento</label>
                <input
                  type="number"
                  className={styles.formInput}
                  value={editData.nascimento || ''}
                  onChange={(e) => setEditData({...editData, nascimento: parseInt(e.target.value)})}
                  min="1900"
                  max={new Date().getFullYear()}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Idade</label>
                <input
                  type="number"
                  className={styles.formInput}
                  value={editData.idade || ''}
                  onChange={(e) => setEditData({...editData, idade: parseInt(e.target.value)})}
                  min="1"
                  max="120"
                  required
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setEditing(false);
                    setEditData(user);
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.saveButton}>
                  Salvar Alterações
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Seção de Livros (apenas para escritores) */}
        {user.tipo === 'ESCRITOR' && (
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>📚</span>
              Meus Livros
            </h2>

            <button 
              className={styles.addBookButton}
              onClick={() => setShowAddBook(!showAddBook)}
            >
              ➕ Adicionar Novo Livro
            </button>

            {showAddBook && (
              <form onSubmit={handleAddBook} className={styles.editForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Título</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={newBook.titulo}
                    onChange={(e) => setNewBook({...newBook, titulo: e.target.value})}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Ano de Lançamento</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={newBook.anoLancamento}
                    onChange={(e) => setNewBook({...newBook, anoLancamento: e.target.value})}
                    min="1500"
                    max={new Date().getFullYear() + 5}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Gênero</label>
                  <select
                    className={styles.formSelect}
                    value={newBook.genero}
                    onChange={(e) => setNewBook({...newBook, genero: e.target.value})}
                    required
                  >
                    <option value="">Selecione um gênero</option>
                    <option value="Romance">Romance</option>
                    <option value="Ficção">Ficção</option>
                    <option value="Não-ficção">Não-ficção</option>
                    <option value="Poesia">Poesia</option>
                    <option value="Drama">Drama</option>
                    <option value="Crônica">Crônica</option>
                    <option value="Ensaio">Ensaio</option>
                    <option value="Biografia">Biografia</option>
                    <option value="História">História</option>
                    <option value="Ciência">Ciência</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Dificuldade</label>
                  <select
                    className={styles.formSelect}
                    value={newBook.dificuldade}
                    onChange={(e) => setNewBook({...newBook, dificuldade: e.target.value})}
                    required
                  >
                    <option value="">Selecione a dificuldade</option>
                    <option value="Fácil">Fácil</option>
                    <option value="Médio">Médio</option>
                    <option value="Difícil">Difícil</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Número de Páginas</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={newBook.numeroPaginas}
                    onChange={(e) => setNewBook({...newBook, numeroPaginas: e.target.value})}
                    min="1"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Preço Médio (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.formInput}
                    value={newBook.mediaPreco}
                    onChange={(e) => setNewBook({...newBook, mediaPreco: e.target.value})}
                    min="0"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>URL da Imagem</label>
                  <input
                    type="url"
                    className={styles.formInput}
                    value={newBook.imagem}
                    onChange={(e) => setNewBook({...newBook, imagem: e.target.value})}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Descrição</label>
                  <textarea
                    className={styles.formTextarea}
                    value={newBook.descricao}
                    onChange={(e) => setNewBook({...newBook, descricao: e.target.value})}
                    placeholder="Descreva o livro..."
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <input
                      type="checkbox"
                      checked={newBook.temAdaptacao}
                      onChange={(e) => setNewBook({...newBook, temAdaptacao: e.target.checked})}
                      style={{ marginRight: '10px' }}
                    />
                    Tem adaptação (filme, série, etc.)
                  </label>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setShowAddBook(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className={styles.saveButton}>
                    Adicionar Livro
                  </button>
                </div>
              </form>
            )}

            {loadingBooks ? (
              <div className={styles.loading}>Carregando livros...</div>
            ) : (
              <div className={styles.booksGrid}>
                {books.map((book) => (
                  <div key={book.id} className={styles.bookCard}>
                    {book.imagem && (
                      <img 
                        src={book.imagem} 
                        alt={book.titulo}
                        className={styles.bookImage}
                      />
                    )}
                    <h3 className={styles.bookTitle}>{book.titulo}</h3>
                    <div className={styles.bookInfo}>📅 {book.anoLancamento}</div>
                    <div className={styles.bookInfo}>📖 {book.genero}</div>
                    <div className={styles.bookInfo}>📄 {book.numeroPaginas} páginas</div>
                    <div className={styles.bookInfo}>💰 R$ {book.mediaPreco}</div>
                    
                    <div className={styles.bookActions}>
                      <button 
                        className={styles.editBookButton}
                        onClick={() => {/* Implementar edição de livro */}}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        className={styles.deleteBookButton}
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                ))}
                
                {books.length === 0 && (
                  <div style={{ 
                    gridColumn: '1 / -1', 
                    textAlign: 'center', 
                    padding: '40px',
                    color: '#4f8209',
                    opacity: 0.7 
                  }}>
                    Nenhum livro cadastrado ainda. Adicione seu primeiro livro!
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
      
      {/* Modal de Escritores Seguidos */}
      <FollowingModal 
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
      />
    </div>
  );
}

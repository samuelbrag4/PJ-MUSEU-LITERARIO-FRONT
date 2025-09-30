'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaUser,
  FaEdit,
  FaCalendarAlt,
  FaBook,
  FaCamera,
  FaUserFriends,
  FaHeart,
  FaPlus,
  FaSave,
  FaTimes,
  FaInfoCircle,
  FaBookOpen,
  FaFileImage
} from 'react-icons/fa';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import FollowingModal from '../../../components/FollowingModal';
import CronogramaLeitura from '../../../components/CronogramaLeitura';
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
  const [showCronograma, setShowCronograma] = useState(false);
  const [estatisticasLeitura, setEstatisticasLeitura] = useState({
    queroLer: 0,
    lendo: 0,
    jaLi: 0,
    total: 0
  });
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

      const meusEscritores = await apiService.getMeusEscritores();
      
      let seguidoresCount = 0;
      
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
        livrosFavoritos: 0
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas sociais:', error);
    }
  };

  const loadEstatisticasLeitura = async () => {
    try {
      const response = await apiService.getMeusFavoritos();
      if (response.estatisticas) {
        setEstatisticasLeitura(response.estatisticas);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas de leitura:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!userData || !token) {
        router.push('/');
        return;
      }

      if (!apiService.isTokenValid()) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
        return;
      }

      const currentUser = JSON.parse(userData);
      setUser(currentUser);
      setEditData(currentUser);

      if (currentUser.tipo === 'ESCRITOR') {
        loadAuthorBooks(currentUser.id);
      }

      loadSocialStats();
      loadEstatisticasLeitura();
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

      await apiService.addBook(bookData);
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
      setShowAddBook(false);
      loadAuthorBooks(user.id);
      setSuccess('Livro adicionado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erro ao adicionar livro:', error);
      setError('Erro ao adicionar livro: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.loading}>Carregando perfil...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          {/* Hero Section do Perfil */}
          <section className={styles.heroSection}>
            <div className={styles.heroContent}>
              {/* Imagem do Perfil */}
              <div className={styles.profileImageContainer}>
                <div className={styles.profileImageWrapper}>
                  {user.foto ? (
                    <img 
                      src={user.foto} 
                      alt={user.nome}
                      className={styles.profileImage}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <FaUser size={80} />
                      <span>Sem foto</span>
                    </div>
                  )}
                  
                  <button 
                    className={styles.photoUploadButton}
                    onClick={() => document.getElementById('photoInput').click()}
                  >
                    <FaCamera />
                  </button>
                  <input
                    id="photoInput"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className={styles.photoUploadInput}
                  />
                </div>
              </div>

              {/* Informações Principais */}
              <div className={styles.profileMainInfo}>
                <div className={styles.profileHeader}>
                  <h1 className={styles.profileTitle}>{user.nome}</h1>
                  <p className={styles.profileSubtitle}>@{user.nomeUsuario}</p>
                  <div className={styles.profileBadge}>
                    {user.tipo === 'ESCRITOR' ? 'Escritor' : 'Leitor'}
                  </div>
                </div>

                {/* Estatísticas Principais */}
                <div className={styles.statsContainer}>
                  <div className={styles.statsGrid}>
                    <div 
                      className={styles.statCard}
                      onClick={() => setShowFollowingModal(true)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className={styles.statNumber}>{socialStats.seguindo}</span>
                      <span className={styles.statLabel}>Seguindo</span>
                    </div>
                    
                    {user.tipo === 'ESCRITOR' && (
                      <div className={styles.statCard}>
                        <span className={styles.statNumber}>{socialStats.seguidores}</span>
                        <span className={styles.statLabel}>Seguidores</span>
                      </div>
                    )}
                    
                    <div className={styles.statCard}>
                      <span className={styles.statNumber}>{books.length}</span>
                      <span className={styles.statLabel}>{user.tipo === 'ESCRITOR' ? 'Livros' : 'Favoritos'}</span>
                    </div>
                  </div>

                  {/* Estatísticas de Leitura */}
                  <div className={styles.readingStatsSection}>
                    <h3 className={styles.readingStatsTitle}>
                      <FaBookOpen />
                      Estatísticas de Leitura
                    </h3>
                    <div className={styles.readingStatsGrid}>
                      <div className={styles.readingStat}>
                        <span className={styles.readingStatNumber}>{estatisticasLeitura.queroLer}</span>
                        <span className={styles.readingStatLabel}>Quero Ler</span>
                      </div>
                      <div className={styles.readingStat}>
                        <span className={styles.readingStatNumber}>{estatisticasLeitura.lendo}</span>
                        <span className={styles.readingStatLabel}>Lendo</span>
                      </div>
                      <div className={styles.readingStat}>
                        <span className={styles.readingStatNumber}>{estatisticasLeitura.jaLi}</span>
                        <span className={styles.readingStatLabel}>Já Li</span>
                      </div>
                      <div className={styles.readingStat}>
                        <span className={styles.readingStatNumber}>{estatisticasLeitura.total}</span>
                        <span className={styles.readingStatLabel}>Total</span>
                      </div>
                    </div>
                    
                    <button 
                      className={styles.cronogramaButton}
                      onClick={() => setShowCronograma(true)}
                    >
                      <FaCalendarAlt />
                      Cronograma de Leitura
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Informações Pessoais */}
          <section className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <FaInfoCircle className={styles.sectionIcon} />
                Informações Pessoais
              </h2>
            </div>

            {!editing ? (
              <>
                <button 
                  className={styles.editButton}
                  onClick={() => setEditing(true)}
                >
                  <FaEdit />
                  Editar Informações
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
                    value={editData.nome || ''}
                    onChange={(e) => setEditData({...editData, nome: e.target.value})}
                    className={styles.formInput}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nome de Usuário</label>
                  <input
                    type="text"
                    value={editData.nomeUsuario || ''}
                    onChange={(e) => setEditData({...editData, nomeUsuario: e.target.value})}
                    className={styles.formInput}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>E-mail</label>
                  <input
                    type="email"
                    value={editData.email || ''}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className={styles.formInput}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Idade</label>
                  <input
                    type="number"
                    value={editData.idade || ''}
                    onChange={(e) => setEditData({...editData, idade: parseInt(e.target.value)})}
                    className={styles.formInput}
                    min="1"
                    max="120"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Ano de Nascimento</label>
                  <input
                    type="number"
                    value={editData.nascimento || ''}
                    onChange={(e) => setEditData({...editData, nascimento: parseInt(e.target.value)})}
                    className={styles.formInput}
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div className={styles.formButtons}>
                  <button type="submit" className={styles.saveButton}>
                    <FaSave />
                    Salvar
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setEditing(false)}
                    className={styles.cancelButton}
                  >
                    <FaTimes />
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Seção de Livros */}
          {user.tipo === 'ESCRITOR' && (
            <section className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <FaBook className={styles.sectionIcon} />
                  Meus Livros
                </h2>
              </div>

              <button 
                className={styles.addBookButton}
                onClick={() => setShowAddBook(!showAddBook)}
              >
                <FaPlus />
                {showAddBook ? 'Cancelar' : 'Adicionar Novo Livro'}
              </button>

              {showAddBook && (
                <form onSubmit={handleAddBook} className={styles.editForm}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Título</label>
                    <input
                      type="text"
                      value={newBook.titulo}
                      onChange={(e) => setNewBook({...newBook, titulo: e.target.value})}
                      className={styles.formInput}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Ano de Lançamento</label>
                    <input
                      type="number"
                      value={newBook.anoLancamento}
                      onChange={(e) => setNewBook({...newBook, anoLancamento: e.target.value})}
                      className={styles.formInput}
                      min="1000"
                      max={new Date().getFullYear() + 10}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Gênero</label>
                    <input
                      type="text"
                      value={newBook.genero}
                      onChange={(e) => setNewBook({...newBook, genero: e.target.value})}
                      className={styles.formInput}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Número de Páginas</label>
                    <input
                      type="number"
                      value={newBook.numeroPaginas}
                      onChange={(e) => setNewBook({...newBook, numeroPaginas: e.target.value})}
                      className={styles.formInput}
                      min="1"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preço Médio (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newBook.mediaPreco}
                      onChange={(e) => setNewBook({...newBook, mediaPreco: e.target.value})}
                      className={styles.formInput}
                      min="0"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>URL da Imagem</label>
                    <input
                      type="url"
                      value={newBook.imagem}
                      onChange={(e) => setNewBook({...newBook, imagem: e.target.value})}
                      className={styles.formInput}
                      placeholder="https://..."
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Descrição</label>
                    <textarea
                      value={newBook.descricao}
                      onChange={(e) => setNewBook({...newBook, descricao: e.target.value})}
                      className={styles.formTextarea}
                      placeholder="Descreva o livro..."
                      required
                    />
                  </div>

                  <div className={styles.formButtons}>
                    <button type="submit" className={styles.saveButton}>
                      <FaSave />
                      Adicionar Livro
                    </button>
                  </div>
                </form>
              )}

              {loadingBooks ? (
                <div className={styles.loading}>Carregando livros...</div>
              ) : books.length > 0 ? (
                <div className={styles.booksGrid}>
                  {books.map(book => (
                    <div key={book.id} className={styles.bookCard}>
                      {book.imagem && (
                        <img 
                          src={book.imagem} 
                          alt={book.titulo}
                          className={styles.bookImage}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <h4 className={styles.bookTitle}>{book.titulo}</h4>
                      <div className={styles.bookInfo}>
                        <FaCalendarAlt /> {book.anoLancamento}
                      </div>
                      <div className={styles.bookInfo}>
                        <FaBook /> {book.genero}
                      </div>
                      {book.numeroPaginas && (
                        <div className={styles.bookInfo}>
                          <FaFileImage /> {book.numeroPaginas} páginas
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noBooks}>
                  <p>Você ainda não publicou nenhum livro.</p>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {/* Modais */}
      {showFollowingModal && (
        <FollowingModal 
          isOpen={showFollowingModal}
          onClose={() => setShowFollowingModal(false)}
        />
      )}

      {showCronograma && (
        <CronogramaLeitura 
          isOpen={showCronograma}
          onClose={() => setShowCronograma(false)}
        />
      )}

      <Footer />
    </>
  );
}

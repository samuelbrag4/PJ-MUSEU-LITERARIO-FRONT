'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaBookOpen, 
  FaBook, 
  FaStar, 
  FaTheaterMasks, 
  FaUser, 
  FaPen, 
  FaSearch, 
  FaRocket,
  FaHeart
} from 'react-icons/fa';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CardBook from '../../components/CardBook';
import styles from './livros.module.css';
import Popup from '../../components/Popup';

export default function Livros() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [livrosPorGenero, setLivrosPorGenero] = useState({});
  const [generosDisponiveis, setGenerosDisponiveis] = useState([]);
  const [autores, setAutores] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [popup, setPopup] = useState({ isVisible: false, type: '', message: '' });
  
  // Estado para adicionar livro
  const [newBook, setNewBook] = useState({
    titulo: '',
    autor: '',
    ano: '',
    descricao: '',
    preco: '',
    imagem: null,
    genero: '',
    dificuldade: '',
    adaptacao: '',
    paginas: ''
  });

  const router = useRouter();

  // Ícones para cada gênero
  const iconesGeneros = {
    'Romance': <FaHeart />,
    'Terror': <FaSearch />,
    'Ficção': <FaStar />,
    'Drama': <FaTheaterMasks />,
    'Aventura': <FaRocket />,
    'Biográfico': <FaUser />,
    'Crônicas': <FaPen />,
    'Poesia': <FaHeart />,
    'Suspense': <FaSearch />,
    'Fantasia': <FaStar />,
    'Sci-fi': <FaRocket />,
    'História': '📜'
  };

  const dificuldades = ['Fácil', 'Médio', 'Difícil'];
  const adaptacoes = ['Sim', 'Não'];

  useEffect(() => {
    // Verificar se há usuário logado
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      router.push('/');
      return;
    }
    
    setUser(JSON.parse(userData));
    setLoading(false);
    
    // Carregar dados da API
    carregarLivrosPorGenero();
    carregarGeneros();
    carregarAutores();
  }, [router]);

  const carregarLivrosPorGenero = async () => {
    try {
      const response = await fetch('http://localhost:5000/livros/por-genero?limite=8');
      const data = await response.json();
      
      if (response.ok) {
        // O backend retorna os dados diretamente organizados por gênero
        setLivrosPorGenero(data || {});
      } else {
        console.error('Erro ao carregar livros por gênero:', data.error);
      }
    } catch (error) {
      console.error('Erro ao carregar livros por gênero:', error);
    }
  };



  const carregarGeneros = async () => {
    try {
      const response = await fetch('http://localhost:5000/livros/generos');
      const data = await response.json();
      
      if (response.ok) {
        // O endpoint pode retornar dados de diferentes formas
        let generos = [];
        
        if (Array.isArray(data)) {
          generos = data;
        } else if (data.generos && Array.isArray(data.generos)) {
          generos = data.generos;
        } else if (typeof data === 'string') {
          // Se retornar uma string com quebras de linha
          generos = data.split('\n').filter(g => g.trim());
        }
        
        setGenerosDisponiveis(generos);
      } else {
        console.error('Erro ao carregar gêneros:', data.error);
      }
    } catch (error) {
      console.error('Erro ao carregar gêneros:', error);
      // Fallback com gêneros padrão
      setGenerosDisponiveis(['Romance', 'Terror', 'Ficção', 'Drama', 'Aventura']);
    }
  };

  const carregarAutores = async () => {
    try {
      // Usar o endpoint de escritores com livros incluídos (mais completo)
      const response = await fetch('http://localhost:5000/escritores');
      const data = await response.json();
      
      if (response.ok) {
        // O endpoint retorna os dados diretamente como array
        const escritores = Array.isArray(data) ? data : (data.value || data.escritores || []);
        setAutores(escritores);
      } else {
        console.error('Erro ao carregar escritores:', data.error);
        // Fallback: tentar endpoint de usuários
        await carregarAutoresFallback();
      }
    } catch (error) {
      console.error('Erro ao carregar escritores:', error);
      // Fallback: tentar endpoint de usuários
      await carregarAutoresFallback();
    }
  };

  const carregarAutoresFallback = async () => {
    try {
      const response = await fetch('http://localhost:5000/users?tipo=escritor');
      const data = await response.json();
      
      if (response.ok) {
        setAutores(data.users || []);
      } else {
        console.error('Erro ao carregar usuários escritores:', data.error);
      }
    } catch (error) {
      console.error('Erro no fallback de autores:', error);
    }
  };

  const showPopup = (type, message) => {
    setPopup({ isVisible: true, type, message });
  };

  const hidePopup = () => {
    setPopup({ isVisible: false, type: '', message: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewBook(prev => ({
        ...prev,
        imagem: file
      }));
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    
    // Verificar se o nome do autor é igual ao nome de usuário
    if (newBook.autor !== user.nome) {
      showPopup('error', 'O nome do autor deve ser idêntico ao seu nome de usuário.');
      return;
    }

    // Validações básicas
    if (!newBook.titulo || !newBook.ano || !newBook.descricao || !newBook.preco || !newBook.genero) {
      showPopup('error', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Adicionar todos os campos ao FormData
      formData.append('titulo', newBook.titulo);
      formData.append('autor', newBook.autor);
      formData.append('ano', parseInt(newBook.ano));
      formData.append('descricao', newBook.descricao);
      formData.append('preco', newBook.preco);
      formData.append('genero', newBook.genero);
      formData.append('dificuldade', newBook.dificuldade);
      formData.append('adaptacao', newBook.adaptacao === 'Sim');
      formData.append('paginas', parseInt(newBook.paginas) || 0);
      
      if (newBook.imagem) {
        formData.append('imagem', newBook.imagem);
      }

      const response = await fetch('http://localhost:5000/livros', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        showPopup('success', 'Livro adicionado com sucesso!');
        setShowAddBookModal(false);
        setNewBook({
          titulo: '',
          autor: '',
          ano: '',
          descricao: '',
          preco: '',
          imagem: null,
          genero: '',
          dificuldade: '',
          adaptacao: '',
          paginas: ''
        });
        // Recarregar dados
        carregarLivrosPorGenero();
        carregarGeneros();
      } else {
        showPopup('error', data.error || 'Erro ao adicionar livro. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao adicionar livro:', error);
      showPopup('error', 'Erro ao adicionar livro. Tente novamente.');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Seção de Introdução */}
          <section className={styles.introSection}>
            <div className={styles.introContent}>
              <h1 className={styles.pageTitle}><FaBookOpen /> Biblioteca Brasileira</h1>
              <p className={styles.pageDescription}>
                Explore o rico universo da literatura brasileira! Aqui você pode descobrir e pesquisar 
                obras incríveis de autores nacionais, organizadas por categorias para facilitar sua busca. 
                Desde clássicos atemporais até obras contemporâneas, nosso acervo celebra a diversidade 
                e riqueza da produção literária do Brasil.
              </p>
              
              {user?.tipo === 'escritor' && (
                <button 
                  className={styles.addBookButton}
                  onClick={() => setShowAddBookModal(true)}
                >
                  ➕ Adicionar Novo Livro
                </button>
              )}
            </div>
          </section>

          {/* Filtros por Categoria */}
          <section className={styles.categoriesSection}>
            <h2 className={styles.sectionTitle}>Explorar por Categoria</h2>
            <div className={styles.categoriesGrid}>
              <button
                className={`${styles.categoryCard} ${selectedCategory === 'todos' ? styles.active : ''}`}
                onClick={() => setSelectedCategory('todos')}
              >
                <span className={styles.categoryIcon}><FaBook /></span>
                <span className={styles.categoryName}>Todos os Livros</span>
              </button>
              
              {generosDisponiveis.map(genero => (
                <button
                  key={genero}
                  className={`${styles.categoryCard} ${selectedCategory === genero ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(genero)}
                >
                  <span className={styles.categoryIcon}>{iconesGeneros[genero] || <FaBookOpen />}</span>
                  <span className={styles.categoryName}>{genero}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Seções de Livros Estilo Netflix */}
          <section className={styles.netflixSection}>
            {selectedCategory === 'todos' ? (
              // Mostrar todas as categorias
              Object.entries(livrosPorGenero).map(([genero, livros]) => (
                <div key={genero} className={styles.genreSection}>
                  <h2 className={styles.genreTitle}>
                    {iconesGeneros[genero] || <FaBookOpen />} {genero}
                  </h2>
                  <div className={styles.booksCarousel}>
                    {livros.map(livro => (
                      <CardBook key={livro.id} livro={livro} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // Mostrar apenas a categoria selecionada
              livrosPorGenero[selectedCategory] && (
                <div className={styles.genreSection}>
                  <h2 className={styles.genreTitle}>
                    {iconesGeneros[selectedCategory] || <FaBookOpen />} {selectedCategory}
                  </h2>
                  <div className={styles.booksGrid}>
                    {livrosPorGenero[selectedCategory].map(livro => (
                      <CardBook key={livro.id} livro={livro} />
                    ))}
                  </div>
                </div>
              )
            )}
          </section>

          {/* Seção de Autores */}
          <section className={styles.authorsSection}>
            <h2 className={styles.sectionTitle}>🖋️ Escritores Brasileiros</h2>
            <div className={styles.authorsGrid}>
              {autores.map(autor => (
                <Link key={autor.id} href={`/autor/${autor.id}`} className={styles.authorCardLink}>
                  <div className={styles.authorCard}>
                    <div className={styles.authorImage}>
                      <img 
                        src={autor.fotoPerfilUrl || autor.foto || '/autores/default.jpg'} 
                        alt={autor.nome}
                        onError={(e) => {
                          e.target.src = '/autores/default.jpg';
                        }}
                      />
                    </div>
                    <div className={styles.authorInfo}>
                      <h3 className={styles.authorName}>{autor.nome}</h3>
                      <p className={styles.authorBooks}>
                        {autor.livros ? `${autor.livros.length} obras` : 
                         autor.totalLivros ? `${autor.totalLivros} obras` : 
                         'Escritor'}
                      </p>
                      {autor.email && (
                        <p className={styles.authorEmail}>{autor.email}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Modal para Adicionar Livro */}
        {showAddBookModal && (
          <div className={styles.modalOverlay} onClick={() => setShowAddBookModal(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>➕ Adicionar Novo Livro</h2>
                <button 
                  className={styles.closeButton}
                  onClick={() => setShowAddBookModal(false)}
                >
                  ✕
                </button>
              </div>
              
              <form className={styles.modalForm} onSubmit={handleAddBook}>
                <div className={styles.formGroup}>
                  <label>Título do Livro *</label>
                  <input
                    type="text"
                    name="titulo"
                    value={newBook.titulo}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Nome do Autor * (deve ser igual ao seu nome de usuário)</label>
                  <input
                    type="text"
                    name="autor"
                    value={newBook.autor}
                    onChange={handleInputChange}
                    placeholder={user?.nome}
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Ano de Lançamento *</label>
                    <input
                      type="number"
                      name="ano"
                      value={newBook.ano}
                      onChange={handleInputChange}
                      min="1500"
                      max="2025"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Número de Páginas</label>
                    <input
                      type="number"
                      name="paginas"
                      value={newBook.paginas}
                      onChange={handleInputChange}
                      min="1"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Descrição do Livro *</label>
                  <textarea
                    name="descricao"
                    value={newBook.descricao}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Preço Médio *</label>
                  <input
                    type="text"
                    name="preco"
                    value={newBook.preco}
                    onChange={handleInputChange}
                    placeholder="Ex: R$ 25,00"
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Gênero *</label>
                    <select
                      name="genero"
                      value={newBook.genero}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione o gênero</option>
                      {generosDisponiveis.map(genero => (
                        <option key={genero} value={genero}>
                          {genero}
                        </option>
                      ))}
                      {/* Opções adicionais caso o gênero não esteja na lista */}
                      <option value="Romance">Romance</option>
                      <option value="Terror">Terror</option>
                      <option value="Ficção">Ficção</option>
                      <option value="Drama">Drama</option>
                      <option value="Aventura">Aventura</option>
                      <option value="Biográfico">Biográfico</option>
                      <option value="Crônicas">Crônicas</option>
                      <option value="Poesia">Poesia</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Dificuldade</label>
                    <select
                      name="dificuldade"
                      value={newBook.dificuldade}
                      onChange={handleInputChange}
                    >
                      <option value="">Selecione a dificuldade</option>
                      {dificuldades.map(dificuldade => (
                        <option key={dificuldade} value={dificuldade}>
                          {dificuldade}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Possui Adaptação?</label>
                  <select
                    name="adaptacao"
                    value={newBook.adaptacao}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione</option>
                    {adaptacoes.map(adaptacao => (
                      <option key={adaptacao} value={adaptacao}>
                        {adaptacao}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Imagem da Capa</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.fileInput}
                  />
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelButton} onClick={() => setShowAddBookModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    Adicionar Livro
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {popup.isVisible && (
          <Popup
            type={popup.type}
            message={popup.message}
            onClose={hidePopup}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
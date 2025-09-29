'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaBook, 
  FaPen, 
  FaUsers, 
  FaList, 
  FaChartBar,
  FaChartLine,
  FaTrophy
} from 'react-icons/fa';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from './home.module.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [itemsPerPage] = useState(6);
  
  // Dashboard statistics states
  const [dashboardStats, setDashboardStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
  const router = useRouter();

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
    
    // Carregar estatísticas do dashboard
    loadDashboardStats();
  }, [router]);

  // Função para carregar estatísticas do dashboard
  const loadDashboardStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch('http://localhost:5000/dashboard/estatisticas');
      
      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data);
      } else {
        console.error('Erro ao carregar estatísticas');
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Search functions
  const handleSearch = async () => {
    if (!searchQuery.trim() && !sortBy) return;
    
    setSearchLoading(true);
    try {
      // Construir URL de busca
      const params = new URLSearchParams();
      
      if (searchQuery.trim()) {
        // Verificar se é um ID (número)
        if (!isNaN(searchQuery) && searchQuery.trim()) {
          params.append('id', searchQuery.trim());
        } else {
          // Pesquisa geral por título, autor ou gênero
          params.append('busca', searchQuery.trim());
        }
      }
      
      if (sortBy) {
        const [field, order] = sortBy.split('_');
        params.append('ordenar', field);
        params.append('ordem', order);
      }
      
      params.append('pagina', currentPage.toString());
      params.append('limite', itemsPerPage.toString());
      
      // Simular resposta da API (substitua pela chamada real)
      const mockResults = await simulateApiCall(params);
      
      setSearchResults(mockResults.books);
      setTotalResults(mockResults.total);
      setTotalPages(Math.ceil(mockResults.total / itemsPerPage));
      
    } catch (error) {
      console.error('Erro na busca:', error);
      setSearchResults([]);
      setTotalResults(0);
      setTotalPages(1);
    } finally {
      setSearchLoading(false);
    }
  };

  // Função para simular API (substitua pela real)
  const simulateApiCall = async (params) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockBooks = [
          {
            id: 1,
            titulo: "Dom Casmurro",
            autor: "Machado de Assis",
            genero: "Romance",
            ano_lancamento: 1899
          },
          {
            id: 2,
            titulo: "O Cortiço",
            autor: "Aluísio Azevedo",
            genero: "Naturalismo",
            ano_lancamento: 1890
          },
          {
            id: 3,
            titulo: "Iracema",
            autor: "José de Alencar",
            genero: "Romance",
            ano_lancamento: 1865
          },
          {
            id: 4,
            titulo: "Capitães da Areia",
            autor: "Jorge Amado",
            genero: "Romance Social",
            ano_lancamento: 1937
          },
          {
            id: 5,
            titulo: "O Guarani",
            autor: "José de Alencar",
            genero: "Romance",
            ano_lancamento: 1857
          },
          {
            id: 6,
            titulo: "Casa Grande & Senzala",
            autor: "Gilberto Freyre",
            genero: "Sociologia",
            ano_lancamento: 1933
          }
        ];
        
        let filteredBooks = [...mockBooks];
        const busca = params.get('busca');
        const id = params.get('id');
        
        if (id) {
          filteredBooks = filteredBooks.filter(book => book.id.toString() === id);
        } else if (busca) {
          const searchTerm = busca.toLowerCase();
          filteredBooks = filteredBooks.filter(book =>
            book.titulo.toLowerCase().includes(searchTerm) ||
            book.autor.toLowerCase().includes(searchTerm) ||
            book.genero.toLowerCase().includes(searchTerm)
          );
        }
        
        // Aplicar ordenação
        const ordenar = params.get('ordenar');
        const ordem = params.get('ordem');
        
        if (ordenar && ordem) {
          filteredBooks.sort((a, b) => {
            let valueA, valueB;
            
            switch (ordenar) {
              case 'titulo':
                valueA = a.titulo.toLowerCase();
                valueB = b.titulo.toLowerCase();
                break;
              case 'autor':
                valueA = a.autor.toLowerCase();
                valueB = b.autor.toLowerCase();
                break;
              case 'ano':
                valueA = a.ano_lancamento;
                valueB = b.ano_lancamento;
                break;
              default:
                return 0;
            }
            
            if (ordem === 'asc') {
              return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
            } else {
              return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
            }
          });
        }
        
        resolve({
          books: filteredBooks,
          total: filteredBooks.length
        });
      }, 500);
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('');
    setSearchResults([]);
    setCurrentPage(1);
    setTotalResults(0);
    setTotalPages(1);
  };

  // Efeito para refazer busca quando página ou filtros mudam
  useEffect(() => {
    if (searchQuery || sortBy) {
      handleSearch();
    }
  }, [currentPage, sortBy]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Bem-vindo ao Museu Literário Brasileiro
              {user && <span className={styles.userName}>, {user.nome}!</span>}
            </h1>
            <p className={styles.heroSubtitle}>
              Explore a rica tradição literária do Brasil através de nossa vasta coleção 
              de obras, biografias e análises dos grandes mestres da literatura nacional.
            </p>
            <div className={styles.heroActions}>
              <button className={styles.primaryButton}>
                Explorar Acervo
              </button>
              <button className={styles.secondaryButton}>
                Conhecer Escritores
              </button>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.bookAnimation}></div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.stats}>
          <div className={styles.container}>
            {statsLoading ? (
              <div className={styles.statsLoading}>
                <div className={styles.spinner}></div>
                <p>Carregando estatísticas...</p>
              </div>
            ) : dashboardStats ? (
              <>
                <div className={styles.statsHeader}>
                  <h2 className={styles.statsTitle}>
                    <FaChartBar /> Estatísticas do Acervo
                  </h2>
                  <p className={styles.statsSubtitle}>
                    Dados atualizados em tempo real do nosso sistema
                  </p>
                </div>
                
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}><FaBook /></div>
                    <div className={styles.statNumber}>
                      {dashboardStats.resumo.totalLivros.toLocaleString()}
                    </div>
                    <div className={styles.statLabel}>Livros Catalogados</div>
                  </div>
                  
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}><FaPen /></div>
                    <div className={styles.statNumber}>
                      {dashboardStats.resumo.totalEscritores.toLocaleString()}
                    </div>
                    <div className={styles.statLabel}>Escritores</div>
                  </div>
                  
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}><FaUsers /></div>
                    <div className={styles.statNumber}>
                      {dashboardStats.resumo.totalUsuarios.toLocaleString()}
                    </div>
                    <div className={styles.statLabel}>Usuários Registrados</div>
                  </div>
                  
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}><FaList /></div>
                    <div className={styles.statNumber}>
                      {dashboardStats.resumo.totalGeneros.toLocaleString()}
                    </div>
                    <div className={styles.statLabel}>Gêneros Literários</div>
                  </div>
                </div>

                {/* Estatísticas Detalhadas */}
                <div className={styles.detailedStats}>
                  <div className={styles.statSection}>
                    <h3 className={styles.statSectionTitle}>
                      <FaChartLine /> Gêneros Mais Populares
                    </h3>
                    <div className={styles.genresList}>
                      {dashboardStats.generosMaisPopulares.slice(0, 5).map((item, index) => (
                        <div key={item.genero} className={styles.genreItem}>
                          <span className={styles.genreRank}>#{index + 1}</span>
                          <span className={styles.genreName}>{item.genero}</span>
                          <span className={styles.genreCount}>{item.quantidade} livros</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.statSection}>
                    <h3 className={styles.statSectionTitle}>
                      <FaTrophy /> Escritores Mais Produtivos
                    </h3>
                    <div className={styles.authorsList}>
                      {dashboardStats.escritoresComMaisLivros.slice(0, 5).map((autor, index) => (
                        <div key={autor.id} className={styles.authorItem}>
                          <span className={styles.authorRank}>#{index + 1}</span>
                          <span className={styles.authorName}>{autor.nome}</span>
                          <span className={styles.authorCount}>{autor.quantidadeLivros} obras</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.statsError}>
                <p>Erro ao carregar estatísticas</p>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Descubra a Literatura Brasileira</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <h3 className={styles.featureTitle}>Acervo Digital</h3>
                <p className={styles.featureDescription}>
                  Explore nossa vasta coleção de obras digitalizadas, desde clássicos 
                  até autores contemporâneos.
                </p>
                <button className={styles.featureButton}>Explorar Livros</button>
              </div>
              
              <div className={styles.featureCard}>
                <h3 className={styles.featureTitle}>Biografias</h3>
                <p className={styles.featureDescription}>
                  Conheça a vida e obra dos grandes nomes da literatura brasileira 
                  através de biografias detalhadas.
                </p>
                <button className={styles.featureButton}>Ver Escritores</button>
              </div>
              
              <div className={styles.featureCard}>
                <h3 className={styles.featureTitle}>Análises</h3>
                <p className={styles.featureDescription}>
                  Acesse análises críticas e interpretações de especialistas sobre 
                  as principais obras literárias.
                </p>
                <button className={styles.featureButton}>Ler Análises</button>
              </div>
              
              <div className={styles.featureCard}>
                <h3 className={styles.featureTitle}>Favoritos</h3>
                <p className={styles.featureDescription}>
                  Crie sua biblioteca pessoal salvando suas obras e autores favoritos 
                  para acesso rápido.
                </p>
                <button className={styles.featureButton}>Meus Favoritos</button>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Books Section */}
        <section className={styles.recentBooks}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Livros em Destaque</h2>
            <div className={styles.booksGrid}>
              <div className={styles.bookCard}>
                <div className={styles.bookCover} style={{backgroundImage: 'linear-gradient(45deg, #8B4513, #D2691E)'}}>
                  <span className={styles.bookCoverTitle}>DOM<br/>CASMURRO</span>
                </div>
                <h3 className={styles.bookTitle}>Dom Casmurro</h3>
                <p className={styles.bookAuthor}>Machado de Assis</p>
                <p className={styles.bookYear}>1899</p>
                <div className={styles.bookRating}>★★★★★</div>
              </div>
              
              <div className={styles.bookCard}>
                <div className={styles.bookCover} style={{backgroundImage: 'linear-gradient(45deg, #006400, #32CD32)'}}>
                  <span className={styles.bookCoverTitle}>O<br/>CORTIÇO</span>
                </div>
                <h3 className={styles.bookTitle}>O Cortiço</h3>
                <p className={styles.bookAuthor}>Aluísio Azevedo</p>
                <p className={styles.bookYear}>1890</p>
                <div className={styles.bookRating}>★★★★★</div>
              </div>
              
              <div className={styles.bookCard}>
                <div className={styles.bookCover} style={{backgroundImage: 'linear-gradient(45deg, #4B0082, #9370DB)'}}>
                  <span className={styles.bookCoverTitle}>VIDAS<br/>SECAS</span>
                </div>
                <h3 className={styles.bookTitle}>Vidas Secas</h3>
                <p className={styles.bookAuthor}>Graciliano Ramos</p>
                <p className={styles.bookYear}>1938</p>
                <div className={styles.bookRating}>★★★★★</div>
              </div>
              
              <div className={styles.bookCard}>
                <div className={styles.bookCover} style={{backgroundImage: 'linear-gradient(45deg, #8B0000, #DC143C)'}}>
                  <span className={styles.bookCoverTitle}>CAPITÃES<br/>DA AREIA</span>
                </div>
                <h3 className={styles.bookTitle}>Capitães da Areia</h3>
                <p className={styles.bookAuthor}>Jorge Amado</p>
                <p className={styles.bookYear}>1937</p>
                <div className={styles.bookRating}>★★★★★</div>
              </div>
            </div>
          </div>
        </section>

        {/* Book Lottery Section */}
        <section className={styles.lotterySection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Sorteio de Livro</h2>
            <p className={styles.sectionSubtitle}>
              Descubra sua próxima leitura! Clique no botão para sortear um livro da literatura brasileira.
            </p>
            <div className={styles.lotteryContainer}>
              <div className={styles.lotteryCard}>
                <div className={styles.lotteryBook}>
                  <div className={styles.bookCover}></div>
                  <h3 id="lotteryTitle">Clique para sortear!</h3>
                  <p id="lotteryAuthor">Autor será revelado</p>
                  <p id="lotteryGenre">Gênero será revelado</p>
                </div>
                <button 
                  className={styles.lotteryButton} 
                  onClick={() => {
                    const books = [
                      { title: "Dom Casmurro", author: "Machado de Assis", genre: "Romance" },
                      { title: "O Cortiço", author: "Aluísio Azevedo", genre: "Naturalismo" },
                      { title: "Iracema", author: "José de Alencar", genre: "Romance Indianista" },
                      { title: "Capitães da Areia", author: "Jorge Amado", genre: "Romance Social" },
                      { title: "Vidas Secas", author: "Graciliano Ramos", genre: "Romance Regional" },
                      { title: "O Guarani", author: "José de Alencar", genre: "Romance Indianista" },
                      { title: "Memórias Póstumas de Brás Cubas", author: "Machado de Assis", genre: "Romance Realista" },
                      { title: "Grande Sertão: Veredas", author: "Guimarães Rosa", genre: "Romance Regional" }
                    ];
                    const randomBook = books[Math.floor(Math.random() * books.length)];
                    document.getElementById('lotteryTitle').textContent = randomBook.title;
                    document.getElementById('lotteryAuthor').textContent = randomBook.author;
                    document.getElementById('lotteryGenre').textContent = randomBook.genre;
                  }}
                >
                  Sortear Livro
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Author Discovery Section */}
        <section className={styles.authorSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Descubra Novos Autores</h2>
            <p className={styles.sectionSubtitle}>
              Conheça escritores brasileiros que talvez você ainda não tenha descoberto.
            </p>
            <div className={styles.authorsGrid}>
              <div className={styles.authorCard}>
                <div className={styles.authorPhoto}></div>
                <h3 className={styles.authorName}>Clarice Lispector</h3>
                <p className={styles.authorBio}>Escritora ucraniano-brasileira, foi uma das mais importantes escritoras do século XX...</p>
                <p className={styles.authorWorks}>Obras: "A Hora da Estrela", "Perto do Coração Selvagem"</p>
                <button className={styles.authorButton}>Conhecer Melhor</button>
              </div>
              
              <div className={styles.authorCard}>
                <div className={styles.authorPhoto}></div>
                <h3 className={styles.authorName}>Lima Barreto</h3>
                <p className={styles.authorBio}>Escritor e jornalista brasileiro, precursor do Modernismo no Brasil...</p>
                <p className={styles.authorWorks}>Obras: "O Triste Fim de Policarpo Quaresma", "Clara dos Anjos"</p>
                <button className={styles.authorButton}>Conhecer Melhor</button>
              </div>
              
              <div className={styles.authorCard}>
                <div className={styles.authorPhoto}></div>
                <h3 className={styles.authorName}>Carolina Maria de Jesus</h3>
                <p className={styles.authorBio}>Escritora brasileira, catadora de papel que se tornou uma das vozes mais importantes...</p>
                <p className={styles.authorWorks}>Obras: "Quarto de Despejo", "Casa de Alvenaria"</p>
                <button className={styles.authorButton}>Conhecer Melhor</button>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className={styles.searchSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Pesquisar Livros</h2>
            
            {/* Search Bar and Filters */}
            <div className={styles.searchContainer}>
              <div className={styles.searchBar}>
                <div className={styles.searchInputWrapper}>
                  <input
                    type="text"
                    placeholder="Pesquisar por título, autor, gênero ou ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                  <button 
                    onClick={handleSearch}
                    className={styles.searchButton}
                    disabled={searchLoading}
                  >
                    {searchLoading ? 'Buscando...' : 'Buscar'}
                  </button>
                </div>
              </div>
              
              {/* Filters */}
              <div className={styles.filtersContainer}>
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Ordenar por:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="">Selecione...</option>
                    <option value="titulo_asc">Título A-Z</option>
                    <option value="titulo_desc">Título Z-A</option>
                    <option value="autor_asc">Autor A-Z</option>
                    <option value="autor_desc">Autor Z-A</option>
                    <option value="ano_asc">Ano ↑ (Antigo → Recente)</option>
                    <option value="ano_desc">Ano ↓ (Recente → Antigo)</option>
                  </select>
                </div>
                
                <button 
                  onClick={clearFilters}
                  className={styles.clearFiltersBtn}
                >
                  Limpar Filtros
                </button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className={styles.searchResults}>
                <div className={styles.resultsHeader}>
                  <h3 className={styles.resultsTitle}>
                    {totalResults} resultado(s) encontrado(s)
                    {searchQuery && ` para "${searchQuery}"`}
                  </h3>
                </div>
                
                <div className={styles.resultsGrid}>
                  {searchResults.map((book) => (
                    <div key={book.id} className={styles.resultCard}>
                      <div className={styles.resultCover}></div>
                      <div className={styles.resultInfo}>
                        <h4 className={styles.resultTitle}>{book.titulo}</h4>
                        <p className={styles.resultAuthor}>{book.autor}</p>
                        <p className={styles.resultGenre}>{book.genero}</p>
                        <p className={styles.resultYear}>{book.ano_lancamento}</p>
                        <div className={styles.resultActions}>
                          <button className={styles.viewBookBtn}>
                            Ver Detalhes
                          </button>
                          <button className={styles.favoriteBtn}>
                            Favoritar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`${styles.paginationBtn} ${currentPage === 1 ? styles.disabled : ''}`}
                    >
                      ← Anterior
                    </button>
                    
                    <div className={styles.paginationInfo}>
                      <span className={styles.paginationText}>
                        Página {currentPage} de {totalPages}
                      </span>
                      <div className={styles.paginationNumbers}>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = Math.max(1, Math.min(totalPages, currentPage - 2 + i));
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`${styles.paginationNumber} ${
                                currentPage === pageNum ? styles.active : ''
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`${styles.paginationBtn} ${currentPage === totalPages ? styles.disabled : ''}`}
                    >
                      Próxima →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* No Results */}
            {searchQuery && searchResults.length === 0 && !searchLoading && (
              <div className={styles.noResults}>
                <h3 className={styles.noResultsTitle}>Nenhum livro encontrado</h3>
                <p className={styles.noResultsText}>
                  Tente pesquisar com outros termos ou verifique se a grafia está correta.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <div className={styles.container}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Comece sua Jornada Literária</h2>
              <p className={styles.ctaDescription}>
                Junte-se a milhares de leitores que já descobriram o prazer da literatura brasileira.
              </p>
              <button className={styles.ctaButton}>Explorar Agora</button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
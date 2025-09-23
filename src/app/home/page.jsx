'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  }, [router]);

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
                📚 Explorar Acervo
              </button>
              <button className={styles.secondaryButton}>
                ✍️ Conhecer Escritores
              </button>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.bookAnimation}>📖</div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.stats}>
          <div className={styles.container}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📚</div>
                <div className={styles.statNumber}>2,847</div>
                <div className={styles.statLabel}>Livros Catalogados</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>✍️</div>
                <div className={styles.statNumber}>456</div>
                <div className={styles.statLabel}>Escritores</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>👥</div>
                <div className={styles.statNumber}>12,389</div>
                <div className={styles.statLabel}>Usuários Ativos</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>⭐</div>
                <div className={styles.statNumber}>18,567</div>
                <div className={styles.statLabel}>Avaliações</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Descubra a Literatura Brasileira</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📖</div>
                <h3 className={styles.featureTitle}>Acervo Digital</h3>
                <p className={styles.featureDescription}>
                  Explore nossa vasta coleção de obras digitalizadas, desde clássicos 
                  até autores contemporâneos.
                </p>
                <button className={styles.featureButton}>Explorar Livros</button>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🎭</div>
                <h3 className={styles.featureTitle}>Biografias</h3>
                <p className={styles.featureDescription}>
                  Conheça a vida e obra dos grandes nomes da literatura brasileira 
                  através de biografias detalhadas.
                </p>
                <button className={styles.featureButton}>Ver Escritores</button>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>💭</div>
                <h3 className={styles.featureTitle}>Análises</h3>
                <p className={styles.featureDescription}>
                  Acesse análises críticas e interpretações de especialistas sobre 
                  as principais obras literárias.
                </p>
                <button className={styles.featureButton}>Ler Análises</button>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>❤️</div>
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
                <div className={styles.bookCover}>📚</div>
                <h3 className={styles.bookTitle}>Dom Casmurro</h3>
                <p className={styles.bookAuthor}>Machado de Assis</p>
                <div className={styles.bookRating}>⭐⭐⭐⭐⭐</div>
              </div>
              
              <div className={styles.bookCard}>
                <div className={styles.bookCover}>📖</div>
                <h3 className={styles.bookTitle}>O Cortiço</h3>
                <p className={styles.bookAuthor}>Aluísio Azevedo</p>
                <div className={styles.bookRating}>⭐⭐⭐⭐⭐</div>
              </div>
              
              <div className={styles.bookCard}>
                <div className={styles.bookCover}>📕</div>
                <h3 className={styles.bookTitle}>Iracema</h3>
                <p className={styles.bookAuthor}>José de Alencar</p>
                <div className={styles.bookRating}>⭐⭐⭐⭐⭐</div>
              </div>
              
              <div className={styles.bookCard}>
                <div className={styles.bookCover}>📗</div>
                <h3 className={styles.bookTitle}>Capitães da Areia</h3>
                <p className={styles.bookAuthor}>Jorge Amado</p>
                <div className={styles.bookRating}>⭐⭐⭐⭐⭐</div>
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
                    {searchLoading ? '🔄' : '🔍'}
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
                  🗑️ Limpar Filtros
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
                      <div className={styles.resultCover}>📚</div>
                      <div className={styles.resultInfo}>
                        <h4 className={styles.resultTitle}>{book.titulo}</h4>
                        <p className={styles.resultAuthor}>{book.autor}</p>
                        <p className={styles.resultGenre}>{book.genero}</p>
                        <p className={styles.resultYear}>{book.ano_lancamento}</p>
                        <div className={styles.resultActions}>
                          <button className={styles.viewBookBtn}>
                            👁️ Ver Detalhes
                          </button>
                          <button className={styles.favoriteBtn}>
                            ❤️ Favoritar
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
                <div className={styles.noResultsIcon}>📭</div>
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
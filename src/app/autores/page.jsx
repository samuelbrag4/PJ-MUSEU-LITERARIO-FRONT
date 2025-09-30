'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaUser, 
  FaBook, 
  FaSearch, 
  FaFilter,
  FaCalendarAlt,
  FaPen,
  FaUserFriends,
  FaCrown
} from 'react-icons/fa';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FollowButton from '../../components/FollowButton';
import apiService from '../../services/api';
import styles from './autores.module.css';

export default function Autores() {
  const [autores, setAutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [generosDisponiveis, setGenerosDisponiveis] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('todos');
  const [rankingEscritores, setRankingEscritores] = useState([]);
  const [showRanking, setShowRanking] = useState(false);
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12); // 12 autores por página
  
  // Estados para filtros avançados
  const [selectedNationality, setSelectedNationality] = useState('todos');
  const [selectedPeriod, setSelectedPeriod] = useState('todos');
  const [sortBy, setSortBy] = useState('nome');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const router = useRouter();

  useEffect(() => {
    carregarAutores();
    carregarGeneros();
    carregarRanking();
  }, []);

  const carregarAutores = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/escritores');
      const data = await response.json();
      
      if (response.ok) {
        const escritores = Array.isArray(data) ? data : (data.value || data.escritores || []);
        setAutores(escritores);
        setFilteredAuthors(escritores);
      } else {
        console.error('Erro ao carregar escritores:', data.error);
        // Fallback: tentar endpoint de usuários
        await carregarAutoresFallback();
      }
    } catch (error) {
      console.error('Erro ao carregar escritores:', error);
      await carregarAutoresFallback();
    } finally {
      setLoading(false);
    }
  };

  const carregarAutoresFallback = async () => {
    try {
      const response = await fetch('http://localhost:5000/users?tipo=escritor');
      const data = await response.json();
      
      if (response.ok) {
        const escritores = data.users || [];
        setAutores(escritores);
        setFilteredAuthors(escritores);
      } else {
        console.error('Erro ao carregar usuários escritores:', data.error);
      }
    } catch (error) {
      console.error('Erro no fallback de autores:', error);
    }
  };

  const carregarGeneros = async () => {
    try {
      const response = await fetch('http://localhost:5000/livros/generos');
      const data = await response.json();
      
      if (response.ok) {
        const generos = Array.isArray(data) ? data : (data.generos || []);
        setGenerosDisponiveis(generos);
      } else {
        console.error('Erro ao carregar gêneros:', data.error);
      }
    } catch (error) {
      console.error('Erro ao carregar gêneros:', error);
    }
  };

  const carregarRanking = async () => {
    try {
      const response = await apiService.getRankingEscritores(10);
      if (response.ranking) {
        setRankingEscritores(response.ranking);
      }
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
    }
  };

  // Filtrar autores por pesquisa, gênero, nacionalidade e período
  useEffect(() => {
    let filtered = autores;

    // Filtrar por termo de pesquisa
    if (searchTerm.trim()) {
      filtered = filtered.filter(autor => 
        autor.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        autor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        autor.nacionalidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        autor.biografia?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por gênero
    if (selectedGenre !== 'todos') {
      filtered = filtered.filter(autor => 
        autor.livros?.some(livro => livro.genero === selectedGenre) ||
        (autor.generosPrincipais && autor.generosPrincipais.includes(selectedGenre))
      );
    }

    // Filtrar por nacionalidade
    if (selectedNationality !== 'todos') {
      filtered = filtered.filter(autor => 
        autor.nacionalidade === selectedNationality
      );
    }

    // Filtrar por período
    if (selectedPeriod !== 'todos') {
      filtered = filtered.filter(autor => {
        const nascimento = new Date(autor.data_nascimento);
        const ano = nascimento.getFullYear();
        
        switch (selectedPeriod) {
          case 'classico':
            return ano < 1900;
          case 'moderno':
            return ano >= 1900 && ano < 1950;
          case 'contemporaneo':
            return ano >= 1950;
          default:
            return true;
        }
      });
    }

    // Ordenar resultados
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'nome':
          aValue = a.nome || '';
          bValue = b.nome || '';
          break;
        case 'data_nascimento':
          aValue = new Date(a.data_nascimento || 0);
          bValue = new Date(b.data_nascimento || 0);
          break;
        case 'nacionalidade':
          aValue = a.nacionalidade || '';
          bValue = b.nacionalidade || '';
          break;
        case 'livros':
          aValue = a.livros?.length || 0;
          bValue = b.livros?.length || 0;
          break;
        default:
          aValue = a.nome || '';
          bValue = b.nome || '';
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredAuthors(filtered);
    setCurrentPage(1); // Resetar para primeira página quando filtros mudarem
  }, [searchTerm, selectedGenre, selectedNationality, selectedPeriod, sortBy, sortOrder, autores]);

  // Função para obter nacionalidades únicas
  const getNacionalidades = () => {
    const nacionalidades = [...new Set(autores.map(autor => autor.nacionalidade).filter(Boolean))];
    return nacionalidades.sort();
  };

  // Função para calcular paginação
  const getPaginatedAuthors = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAuthors.slice(startIndex, endIndex);
  };

  // Função para calcular total de páginas
  const getTotalPages = () => {
    return Math.ceil(filteredAuthors.length / itemsPerPage);
  };

  // Função para mudar página
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll para o topo da seção de autores
    document.querySelector(`.${styles.authorsSection}`)?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  const formatarData = (dataString) => {
    if (!dataString) return '';
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    } catch {
      return dataString;
    }
  };

  const calcularIdade = (dataNascimento, dataFalecimento) => {
    try {
      const nascimento = new Date(dataNascimento);
      const referencia = dataFalecimento ? new Date(dataFalecimento) : new Date();
      const idade = referencia.getFullYear() - nascimento.getFullYear();
      return idade;
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.loading}>Carregando autores...</div>
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
          {/* Hero Section */}
          <section className={styles.heroSection}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                <FaPen /> Escritores Brasileiros
              </h1>
              <p className={styles.heroSubtitle}>
                Conheça os grandes nomes da literatura brasileira! Explore biografias, obras e 
                o legado dos autores que moldaram nossa cultura literária.
              </p>
              
              <div className={styles.heroStats}>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{autores.length}</span>
                  <span className={styles.statLabel}>Escritores</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>
                    {autores.reduce((total, autor) => total + (autor.livros?.length || 0), 0)}
                  </span>
                  <span className={styles.statLabel}>Obras</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{generosDisponiveis.length}</span>
                  <span className={styles.statLabel}>Gêneros</span>
                </div>
              </div>
            </div>
          </section>

          {/* Barra de Pesquisa e Filtros */}
          <section className={styles.searchSection}>
            <div className={styles.searchContainer}>
              <h2 className={styles.searchTitle}>🔍 Encontre seu autor favorito</h2>
              
              <div className={styles.searchBox}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Pesquisar por nome, email, nacionalidade ou biografia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <div className={styles.filtersSection}>
                <div className={styles.filterRow}>
                  <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>
                      <FaFilter /> Gênero:
                    </label>
                    <select
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="todos">Todos os gêneros</option>
                      {generosDisponiveis.map(genero => (
                        <option key={genero} value={genero}>{genero}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>
                      🌍 Nacionalidade:
                    </label>
                    <select
                      value={selectedNationality}
                      onChange={(e) => setSelectedNationality(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="todos">Todas as nacionalidades</option>
                      {getNacionalidades().map(nacionalidade => (
                        <option key={nacionalidade} value={nacionalidade}>
                          {nacionalidade}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>
                      <FaCalendarAlt /> Período:
                    </label>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="todos">Todos os períodos</option>
                      <option value="classico">Clássico (até 1900)</option>
                      <option value="moderno">Moderno (1900-1950)</option>
                      <option value="contemporaneo">Contemporâneo (1950+)</option>
                    </select>
                  </div>
                </div>

                <div className={styles.sortRow}>
                  <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>
                      📊 Ordenar por:
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="nome">Nome</option>
                      <option value="data_nascimento">Data de Nascimento</option>
                      <option value="nacionalidade">Nacionalidade</option>
                      <option value="livros">Número de Livros</option>
                    </select>
                  </div>

                  <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>
                      🔄 Ordem:
                    </label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="asc">Crescente</option>
                      <option value="desc">Decrescente</option>
                    </select>
                  </div>

                  <div className={styles.resultsInfo}>
                    <span className={styles.resultsCount}>
                      {filteredAuthors.length} {filteredAuthors.length === 1 ? 'autor encontrado' : 'autores encontrados'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Seção de Top Escritores */}
          {rankingEscritores.length > 0 && (
            <section className={styles.rankingSection}>
              <div className={styles.rankingHeader}>
                <h2 className={styles.rankingTitle}>
                  <FaCrown /> Top Escritores Mais Seguidos
                </h2>
                <button 
                  className={styles.toggleRankingButton}
                  onClick={() => setShowRanking(!showRanking)}
                >
                  {showRanking ? 'Ocultar' : 'Ver Ranking'}
                </button>
              </div>
              
              {showRanking && (
                <div className={styles.rankingGrid}>
                  {rankingEscritores.slice(0, 6).map((autor, index) => (
                    <div key={autor.id} className={styles.rankingCard}>
                      <div className={styles.rankingPosition}>#{index + 1}</div>
                      <div className={styles.rankingImage}>
                        <img 
                          src={autor.foto || '/autores/default.jpg'} 
                          alt={autor.nome}
                          onError={(e) => {
                            console.log(`Imagem do autor não encontrada: ${e.target.src}`);
                            e.target.style.display = 'none';
                            const placeholder = document.createElement('div');
                            placeholder.className = styles.imagePlaceholder;
                            placeholder.innerHTML = `
                              <div style="font-size: 2rem; color: #4f8209;">👤</div>
                            `;
                            e.target.parentNode.appendChild(placeholder);
                          }}
                          onLoad={(e) => {
                            const placeholder = e.target.parentNode.querySelector(`.${styles.imagePlaceholder}`);
                            if (placeholder) {
                              placeholder.remove();
                            }
                          }}
                        />
                      </div>
                      <div className={styles.rankingInfo}>
                        <h4 className={styles.rankingName}>{autor.nome}</h4>
                        <div className={styles.rankingStats}>
                          <span><FaUserFriends /> {autor.totalSeguidores} seguidores</span>
                          <span><FaBook /> {autor.totalLivros} obras</span>
                        </div>
                        <div className={styles.rankingActions}>
                          <FollowButton 
                            escritorId={autor.id} 
                            escritorNome={autor.nome}
                            onFollowChange={() => carregarRanking()}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Barra de Pesquisa */}
          <section className={styles.searchSection}>
            <div className={styles.searchContainer}>
              <div className={styles.searchBox}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Pesquisar autores por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>
          </section>

          {/* Filtros por Gênero */}
          <section className={styles.filtersSection}>
            <h2 className={styles.sectionTitle}>Filtrar por Gênero Literário</h2>
            <div className={styles.genreFilters}>
              <button
                className={`${styles.genreButton} ${selectedGenre === 'todos' ? styles.active : ''}`}
                onClick={() => setSelectedGenre('todos')}
              >
                <FaBook /> Todos
              </button>
              {generosDisponiveis.map(genero => (
                <button
                  key={genero}
                  className={`${styles.genreButton} ${selectedGenre === genero ? styles.active : ''}`}
                  onClick={() => setSelectedGenre(genero)}
                >
                  {genero}
                </button>
              ))}
            </div>
          </section>

          {/* Grid de Autores */}
          <section className={styles.authorsSection}>
            <div className={styles.authorsHeader}>
              <h2 className={styles.sectionTitle}>
                <FaUser /> {filteredAuthors.length} Autor{filteredAuthors.length !== 1 ? 'es' : ''} Encontrado{filteredAuthors.length !== 1 ? 's' : ''}
              </h2>
              {getTotalPages() > 1 && (
                <div className={styles.pageInfo}>
                  Página {currentPage} de {getTotalPages()} | 
                  Mostrando {getPaginatedAuthors().length} de {filteredAuthors.length} autores
                </div>
              )}
            </div>

            {filteredAuthors.length > 0 ? (
              <>
                <div className={styles.authorsGrid}>
                  {getPaginatedAuthors().map(autor => (
                  <div key={autor.id} className={styles.authorCard}>
                    <div className={styles.authorImage}>
                      <img 
                        src={autor.fotoPerfilUrl || autor.foto || '/autores/default.jpg'} 
                        alt={autor.nome}
                        onError={(e) => {
                          console.log(`Imagem do autor não encontrada: ${e.target.src}`);
                          e.target.style.display = 'none';
                          const placeholder = document.createElement('div');
                          placeholder.className = styles.imagePlaceholder;
                          placeholder.innerHTML = `
                            <div style="font-size: 3rem; color: #4f8209; margin-bottom: 8px;">👤</div>
                            <div style="font-size: 0.9rem; color: #6b8e23; text-align: center;">${autor.nome}</div>
                          `;
                          e.target.parentNode.appendChild(placeholder);
                        }}
                        onLoad={(e) => {
                          const placeholder = e.target.parentNode.querySelector(`.${styles.imagePlaceholder}`);
                          if (placeholder) {
                            placeholder.remove();
                          }
                        }}
                      />
                      {/* Badge de ranking se for top autor */}
                      {autor.ranking && autor.ranking <= 3 && (
                        <div className={styles.rankingBadge}>
                          <FaCrown /> #{autor.ranking}
                        </div>
                      )}
                    </div>
                    
                    <div className={styles.authorInfo}>
                      <Link href={`/autor/${autor.id}`} className={styles.authorNameLink}>
                        <h3 className={styles.authorName}>{autor.nome}</h3>
                      </Link>
                      
                      {autor.dataNascimento && (
                        <div className={styles.authorDate}>
                          <FaCalendarAlt />
                          <span>
                            {formatarData(autor.dataNascimento)}
                            {calcularIdade(autor.dataNascimento, autor.dataFalecimento) && 
                              ` (${calcularIdade(autor.dataNascimento, autor.dataFalecimento)} anos${autor.dataFalecimento ? ' quando faleceu' : ''})`
                            }
                          </span>
                        </div>
                      )}
                      
                      <div className={styles.authorStats}>
                        <span className={styles.bookCount}>
                          <FaBook /> {autor.livros?.length || autor.totalLivros || 0} obra{(autor.livros?.length || autor.totalLivros || 0) !== 1 ? 's' : ''}
                        </span>
                        <span className={styles.followersCount}>
                          <FaUserFriends /> {autor.totalSeguidores || 0} seguidor{(autor.totalSeguidores || 0) !== 1 ? 'es' : ''}
                        </span>
                      </div>
                      
                      {autor.biografia && (
                        <p className={styles.authorBio}>
                          {autor.biografia.length > 150 
                            ? `${autor.biografia.substring(0, 150)}...` 
                            : autor.biografia}
                        </p>
                      )}
                      
                      {/* Gêneros do autor */}
                      {autor.livros && autor.livros.length > 0 && (
                        <div className={styles.authorGenres}>
                          {[...new Set(autor.livros.map(livro => livro.genero).filter(Boolean))].slice(0, 3).map(genero => (
                            <span key={genero} className={styles.genreTag}>
                              {genero}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Botão de seguir */}
                      <div className={styles.authorActions}>
                        <FollowButton 
                          escritorId={autor.id} 
                          escritorNome={autor.nome}
                          onFollowChange={(escritorId, seguindo) => {
                            // Atualizar contador de seguidores localmente
                            setAutores(prev => prev.map(a => 
                              a.id === escritorId 
                                ? { ...a, totalSeguidores: (a.totalSeguidores || 0) + (seguindo ? 1 : -1) }
                                : a
                            ));
                          }}
                        />
                        <Link href={`/autor/${autor.id}`} className={styles.viewProfileButton}>
                          <FaUser /> Ver Perfil
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginação */}
              {getTotalPages() > 1 && (
                <div className={styles.paginationSection}>
                  <div className={styles.pagination}>
                    {/* Botão Anterior */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`${styles.paginationButton} ${styles.paginationArrow} ${currentPage === 1 ? styles.disabled : ''}`}
                    >
                      ← Anterior
                    </button>

                    {/* Números das páginas */}
                    <div className={styles.paginationNumbers}>
                      {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map(page => {
                        // Mostrar apenas páginas próximas à atual
                        if (
                          page === 1 ||
                          page === getTotalPages() ||
                          (page >= currentPage - 2 && page <= currentPage + 2)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`${styles.paginationButton} ${styles.paginationNumber} ${
                                page === currentPage ? styles.active : ''
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 3 ||
                          page === currentPage + 3
                        ) {
                          return <span key={page} className={styles.paginationEllipsis}>...</span>;
                        }
                        return null;
                      })}
                    </div>

                    {/* Botão Próximo */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === getTotalPages()}
                      className={`${styles.paginationButton} ${styles.paginationArrow} ${
                        currentPage === getTotalPages() ? styles.disabled : ''
                      }`}
                    >
                      Próximo →
                    </button>
                  </div>

                  {/* Informações adicionais */}
                  <div className={styles.paginationInfo}>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className={styles.itemsPerPageSelect}
                    >
                      <option value={12}>12 por página</option>
                      <option value={24}>24 por página</option>
                      <option value={36}>36 por página</option>
                    </select>
                  </div>
                </div>
              )}
            </>
            ) : (
              <div className={styles.noResults}>
                <FaSearch className={styles.noResultsIcon} />
                <h3>Nenhum autor encontrado</h3>
                <p>
                  {searchTerm 
                    ? `Não encontramos autores com o termo "${searchTerm}".`
                    : selectedGenre !== 'todos' 
                      ? `Não há autores cadastrados no gênero "${selectedGenre}".`
                      : 'Não há autores cadastrados no momento.'
                  }
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
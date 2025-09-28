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

  // Filtrar autores por pesquisa e gênero
  useEffect(() => {
    let filtered = autores;

    // Filtrar por termo de pesquisa
    if (searchTerm.trim()) {
      filtered = filtered.filter(autor => 
        autor.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        autor.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por gênero
    if (selectedGenre !== 'todos') {
      filtered = filtered.filter(autor => 
        autor.livros?.some(livro => livro.genero === selectedGenre) ||
        (autor.generosPrincipais && autor.generosPrincipais.includes(selectedGenre))
      );
    }

    setFilteredAuthors(filtered);
  }, [searchTerm, selectedGenre, autores]);

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
          {/* Seção de Introdução */}
          <section className={styles.introSection}>
            <div className={styles.introContent}>
              <h1 className={styles.pageTitle}><FaPen /> Escritores Brasileiros</h1>
              <p className={styles.pageDescription}>
                Conheça os grandes nomes da literatura brasileira! Explore biografias, obras e 
                o legado dos autores que moldaram nossa cultura literária. Desde os clássicos 
                até os contemporâneos, descubra a riqueza da produção literária nacional.
              </p>
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
            </div>

            {filteredAuthors.length > 0 ? (
              <div className={styles.authorsGrid}>
                {filteredAuthors.map(autor => (
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
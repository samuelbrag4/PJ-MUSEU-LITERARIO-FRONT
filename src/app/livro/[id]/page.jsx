'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaExclamationTriangle, 
  FaCalendarAlt, 
  FaTheaterMasks, 
  FaDollarSign, 
  FaBookOpen, 
  FaChartBar, 
  FaFilm, 
  FaBook,
  FaPen,
  FaHeart,
  FaRegHeart,
  FaSpinner,
  FaTimes,
  FaCheckCircle
} from 'react-icons/fa';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import CardBook from '../../../components/CardBook';
import apiService from '../../../services/api';
import styles from './livro.module.css';

const STATUS_ICONS = {
  'QUERO_LER': FaBook,
  'LENDO': FaBookOpen,
  'JA_LI': FaCheckCircle
};

const STATUS_LABELS = {
  'QUERO_LER': 'Quero Ler',
  'LENDO': 'Lendo',
  'JA_LI': 'Já Li'
};

const STATUS_COLORS = {
  'QUERO_LER': '#007bff',
  'LENDO': '#ffc107',
  'JA_LI': '#28a745'
};

export default function LivroPage() {
  const [livro, setLivro] = useState(null);
  const [autor, setAutor] = useState(null);
  const [outrosLivrosDoAutor, setOutrosLivrosDoAutor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para favorito e status de leitura
  const [isFavorite, setIsFavorite] = useState(false);
  const [readingStatus, setReadingStatus] = useState(null);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [showStatusSelector, setShowStatusSelector] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const livroId = params.id;

  useEffect(() => {
    if (livroId) {
      carregarLivro();
    }
  }, [livroId]);

  const carregarLivro = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('� Carregando livro com ID:', livroId);
      
      const data = await apiService.getBookById(livroId);
      console.log('📦 Dados retornados pelo apiService:', data);
      console.log('🔍 Estrutura dos dados:', JSON.stringify(data, null, 2));
      console.log('🔍 data.livro existe?', !!data?.livro);
      console.log('🔍 Propriedades do data:', Object.keys(data || {}));
      
      // Verificar diferentes estruturas de resposta
      let livroData = null;
      
      if (data && data.livro) {
        // Estrutura: { livro: {...} }
        livroData = data.livro;
        console.log('✅ Livro encontrado (estrutura livro):', livroData.titulo);
      } else if (data && data.id) {
        // Estrutura: livro diretamente
        livroData = data;
        console.log('✅ Livro encontrado (estrutura direta):', livroData.titulo);
      } else if (data && data.titulo) {
        // Estrutura: livro com título
        livroData = data;
        console.log('✅ Livro encontrado (com título):', livroData.titulo);
      }
      
      if (livroData) {
        setLivro(livroData);
        await carregarAutorDoLivro(livroData.autorId);
      } else {
        console.log('❌ Dados inválidos retornados:', data);
        setError('Livro não encontrado.');
      }
      
    } catch (error) {
      console.error('Erro ao carregar livro:', error);
      setError('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const carregarAutorDoLivro = async (autorId) => {
    try {
      // Buscar dados do autor usando apiService
      const data = await apiService.request('/escritores');
      const escritores = Array.isArray(data) ? data : (data.value || []);
      
      const autorEncontrado = escritores.find(escritor => escritor.id === autorId);
      
      if (autorEncontrado) {
        setAutor(autorEncontrado);
        
        // Filtrar outros livros do mesmo autor (excluindo o atual)
        const outrosLivros = (autorEncontrado.livros || []).filter(l => l.id !== parseInt(livroId));
        setOutrosLivrosDoAutor(outrosLivros);
      }
    } catch (error) {
      console.error('Erro ao carregar autor:', error);
    }
  };

  const formatarData = (data) => {
    if (!data) return null;
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDificuldadeColor = (dificuldade) => {
    switch (dificuldade?.toUpperCase()) {
      case 'FACIL': return '#4CAF50';
      case 'MEDIA': return '#FF9800';
      case 'DIFICIL': return '#F44336';
      default: return '#4f8209';
    }
  };

  const getDificuldadeText = (dificuldade) => {
    switch (dificuldade?.toUpperCase()) {
      case 'FACIL': return 'Fácil';
      case 'MEDIA': return 'Médio';
      case 'DIFICIL': return 'Difícil';
      default: return 'Não informado';
    }
  };

  const handleFavoriteClick = async () => {
    if (isLoadingFavorite) return;
    
    try {
      setIsLoadingFavorite(true);
      
      if (isFavorite) {
        // Remover dos favoritos
        await apiService.removeFavorite(livroId);
        setIsFavorite(false);
      } else {
        // Adicionar aos favoritos
        await apiService.addFavorite(livroId, readingStatus || 'QUERO_LER');
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (isLoadingStatus) return;
    
    try {
      setIsLoadingStatus(true);
      
      if (isFavorite) {
        // Atualizar status do favorito existente
        await apiService.atualizarStatusLeitura(livroId, { status: newStatus });
      } else {
        // Adicionar aos favoritos com o status
        await apiService.addFavorite(livroId, newStatus);
        setIsFavorite(true);
      }
      
      setReadingStatus(newStatus);
      setShowStatusSelector(false);
    } catch (error) {
      console.error('Erro ao atualizar status de leitura:', error);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handleStatusSelectorClick = () => {
    setShowStatusSelector(!showStatusSelector);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.loading}>Carregando livro...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.error}>
              <h2><FaExclamationTriangle /> {error}</h2>
              <button 
                className={styles.backButton}
                onClick={() => router.back()}
              >
                Voltar
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!livro) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.error}>
              <h2><FaExclamationTriangle /> Livro não encontrado</h2>
              <button 
                className={styles.backButton}
                onClick={() => router.back()}
              >
                Voltar
              </button>
            </div>
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
          {/* Botão Voltar */}
          <button 
            className={styles.backButton}
            onClick={() => router.back()}
          >
            ← Voltar aos Livros
          </button>

          {/* Hero Section do Livro */}
          <section className={styles.heroSection}>
            <div className={styles.heroContent}>
              <div className={styles.bookImageContainer}>
                <div className={styles.bookImageWrapper}>
                  <img 
                    src={livro.imagem || '/livros/default.jpg'} 
                    alt={livro.titulo}
                    className={styles.bookImage}
                    onError={(e) => {
                      console.log(`Imagem do livro não encontrada: ${e.target.src}`);
                      e.target.style.display = 'none';
                      const placeholder = document.createElement('div');
                      placeholder.className = styles.imagePlaceholder;
                      placeholder.innerHTML = `
                        <div style="font-size: 4rem; color: #4f8209; margin-bottom: 10px;">📚</div>
                        <div style="font-size: 1rem; color: #6b8e23; text-align: center; padding: 0 10px;">${livro.titulo}</div>
                      `;
                      e.target.parentNode.appendChild(placeholder);
                    }}
                  />
                </div>
              </div>
              
              <div className={styles.bookMainMainInfo}>
                <div className={styles.bookHeader}>
                  <h1 className={styles.bookTitle}>{livro.titulo}</h1>
                  
                  {autor && (
                    <div className={styles.authorInfo}>
                      <FaPen className={styles.authorIcon} />
                      <span>por </span>
                      <Link href={`/autor/${autor.id}`} className={styles.authorLink}>
                        {autor.nome}
                      </Link>
                    </div>
                  )}
                </div>

                <div className={styles.bookMeta}>
                  <div className={styles.metaGrid}>
                    <div className={styles.metaItem}>
                      <FaCalendarAlt className={styles.metaIcon} />
                      <span className={styles.metaLabel}>Ano</span>
                      <span className={styles.metaValue}>{livro.anoLancamento}</span>
                    </div>
                    
                    <div className={styles.metaItem}>
                      <FaTheaterMasks className={styles.metaIcon} />
                      <span className={styles.metaLabel}>Gênero</span>
                      <span className={styles.metaValue}>{livro.genero}</span>
                    </div>
                    
                    <div className={styles.metaItem}>
                      <FaBookOpen className={styles.metaIcon} />
                      <span className={styles.metaLabel}>Páginas</span>
                      <span className={styles.metaValue}>{livro.numeroPaginas}</span>
                    </div>
                    
                    <div className={styles.metaItem}>
                      <FaDollarSign className={styles.metaIcon} />
                      <span className={styles.metaLabel}>Preço</span>
                      <span className={styles.metaValue}>R$ {livro.mediaPreco}</span>
                    </div>
                    
                    <div className={styles.metaItem}>
                      <FaChartBar className={styles.metaIcon} />
                      <span className={styles.metaLabel}>Dificuldade</span>
                      <span 
                        className={styles.difficultyBadge}
                        style={{ backgroundColor: getDificuldadeColor(livro.dificuldade) }}
                      >
                        {getDificuldadeText(livro.dificuldade)}
                      </span>
                    </div>
                    
                    {livro.temAdaptacao && (
                      <div className={styles.metaItem}>
                        <FaFilm className={styles.metaIcon} />
                        <span className={styles.metaLabel}>Adaptação</span>
                        <span className={styles.adaptationBadge}>Disponível</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className={styles.bookActions}>
                  {/* Botão de Favoritar */}
                  <button
                    className={`${styles.favoriteButton} ${isFavorite ? styles.favorited : ''}`}
                    onClick={handleFavoriteClick}
                    disabled={isLoadingFavorite}
                    title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  >
                    {isLoadingFavorite ? (
                      <FaSpinner className={styles.spinner} />
                    ) : isFavorite ? (
                      <FaHeart />
                    ) : (
                      <FaRegHeart />
                    )}
                    <span>
                      {isLoadingFavorite ? 'Carregando...' : isFavorite ? 'Favorito' : 'Favoritar'}
                    </span>
                  </button>

                  {/* Seletor de Status de Leitura */}
                  <div className={styles.statusSelector}>
                    <button
                      className={`${styles.statusButton} ${readingStatus ? styles.hasStatus : ''}`}
                      onClick={handleStatusSelectorClick}
                      disabled={isLoadingStatus}
                      title="Status de leitura"
                    >
                      {isLoadingStatus ? (
                        <FaSpinner className={styles.spinner} />
                      ) : readingStatus ? (
                        (() => {
                          const StatusIcon = STATUS_ICONS[readingStatus];
                          return (
                            <>
                              <StatusIcon style={{ color: STATUS_COLORS[readingStatus] }} />
                              <span>{STATUS_LABELS[readingStatus]}</span>
                            </>
                          );
                        })()
                      ) : (
                        <>
                          <FaBook />
                          <span>Marcar Status</span>
                        </>
                      )}
                    </button>

                    {showStatusSelector && (
                      <div className={styles.statusDropdown}>
                        <div className={styles.statusDropdownHeader}>
                          <span>Status de Leitura</span>
                          <button
                            className={styles.closeDropdown}
                            onClick={() => setShowStatusSelector(false)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                        <div className={styles.statusOptions}>
                          {Object.entries(STATUS_LABELS).map(([key, label]) => {
                            const StatusIcon = STATUS_ICONS[key];
                            return (
                              <button
                                key={key}
                                className={`${styles.statusOption} ${readingStatus === key ? styles.active : ''}`}
                                onClick={() => handleStatusChange(key)}
                                disabled={isLoadingStatus}
                              >
                                <StatusIcon style={{ color: STATUS_COLORS[key] }} />
                                <span>{label}</span>
                                {readingStatus === key && <FaCheckCircle className={styles.checkIcon} />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Descrição do Livro */}
          {livro.descricao && (
            <section className={styles.descriptionSection}>
              <div className={styles.descriptionContainer}>
                <h2 className={styles.sectionTitle}>
                  <FaBook className={styles.sectionIcon} />
                  Sobre o Livro
                </h2>
                <p className={styles.descriptionText}>{livro.descricao}</p>
              </div>
            </section>
          )}

          {/* Informações do Autor */}
          {autor && (
            <section className={styles.authorSection}>
              <h2 className={styles.sectionTitle}>
                ✍️ Sobre o Autor
              </h2>
              
              <Link href={`/autor/${autor.id}`} className={styles.authorCard}>
                <div className={styles.authorImage}>
                  <img 
                    src={autor.foto || '/autores/default.jpg'} 
                    alt={autor.nome}
                    onError={(e) => {
                      e.target.src = '/autores/default.jpg';
                    }}
                  />
                </div>
                <div className={styles.authorInfo}>
                  <h3 className={styles.authorName}>{autor.nome}</h3>
                  {autor.biografia && (
                    <p className={styles.authorBio}>
                      {autor.biografia.length > 200 
                        ? `${autor.biografia.substring(0, 200)}...` 
                        : autor.biografia}
                    </p>
                  )}
                  <div className={styles.authorStats}>
                    <span><FaBook /> {autor.livros?.length || 0} obras</span>
                    {autor.email && <span>📧 {autor.email}</span>}
                  </div>
                  <span className={styles.clickHint}>Clique para ver mais →</span>
                </div>
              </Link>
            </section>
          )}

          {/* Outros Livros do Autor */}
          {outrosLivrosDoAutor.length > 0 && (
            <section className={styles.otherBooksSection}>
              <h2 className={styles.sectionTitle}>
                <FaBookOpen /> Outros livros de {autor?.nome}
              </h2>
              
              <div className={styles.booksGrid}>
                {outrosLivrosDoAutor.map(outroLivro => (
                  <CardBook key={outroLivro.id} livro={outroLivro} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
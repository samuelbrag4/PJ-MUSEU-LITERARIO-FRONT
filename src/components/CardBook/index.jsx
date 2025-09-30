import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaChartBar, 
  FaFilm, 
  FaBook, 
  FaBookOpen, 
  FaCheckCircle, 
  FaHeart, 
  FaRegHeart,
  FaSpinner,
  FaTimes
} from 'react-icons/fa';
import apiService from '../../services/api';
import styles from './cardBook.module.css';

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

export default function CardBook({ 
  livro, 
  showReadingStatus = false, 
  onStatusChange = null,
  showFavoriteButton = true,
  showReadingSelector = true,
  isFavorited = false,
  currentStatus = null
}) {
  const [isFavorite, setIsFavorite] = useState(isFavorited);
  const [readingStatus, setReadingStatus] = useState(currentStatus || livro.statusLeitura);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [showStatusSelector, setShowStatusSelector] = useState(false);

  useEffect(() => {
    setIsFavorite(isFavorited);
    setReadingStatus(currentStatus || livro.statusLeitura);
  }, [isFavorited, currentStatus, livro.statusLeitura]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoadingFavorite) return;
    
    try {
      setIsLoadingFavorite(true);
      
      if (isFavorite) {
        // Remover dos favoritos
        await apiService.removeFavorite(livro.id);
        setIsFavorite(false);
      } else {
        // Adicionar aos favoritos
        await apiService.addFavorite(livro.id, readingStatus || 'QUERO_LER');
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
        await apiService.atualizarStatusLeitura(livro.id, { status: newStatus });
      } else {
        // Adicionar aos favoritos com o status
        await apiService.addFavorite(livro.id, newStatus);
        setIsFavorite(true);
      }
      
      setReadingStatus(newStatus);
      setShowStatusSelector(false);
      
      if (onStatusChange) {
        onStatusChange(livro.id, newStatus);
      }
    } catch (error) {
      console.error('Erro ao atualizar status de leitura:', error);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handleStatusSelectorClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowStatusSelector(!showStatusSelector);
  };

  if (!livro) return null;

  return (
    <Link href={`/livro/${livro.id}`} className={styles.bookCardLink}>
      <div className={styles.bookCard}>
        <div className={styles.bookImage}>
          <img 
            src={livro.imagem || '/images/book-placeholder.svg'} 
            alt={livro.titulo}
            loading="lazy"
            onError={(e) => {
              // Com as novas imagens ui-avatars, raramente precisaremos do fallback
              // Mas mantemos como segurança para casos extremos
              if (e.target.src !== '/images/book-placeholder.svg') {
                e.target.src = '/images/book-placeholder.svg';
                return;
              }
              
              // Fallback final apenas se o SVG também falhar
              e.target.style.display = 'none';
              if (!e.target.parentNode.querySelector(`.${styles.imagePlaceholder}`)) {
                const placeholder = document.createElement('div');
                placeholder.className = styles.imagePlaceholder;
                placeholder.innerHTML = `
                  <div class="${styles.placeholderIcon}">📚</div>
                  <div class="${styles.placeholderText}">${livro.titulo}</div>
                `;
                e.target.parentNode.appendChild(placeholder);
              }
            }}
          />
        </div>
        <div className={styles.bookInfo}>
          {/* Ações do Card - Movidas para o topo */}
          <div className={styles.cardActions}>
            {/* Botão de Favoritar */}
            {showFavoriteButton && (
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
              </button>
            )}

            {/* Seletor de Status de Leitura */}
            {showReadingSelector && (
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
                      return <StatusIcon style={{ color: STATUS_COLORS[readingStatus] }} />;
                    })()
                  ) : (
                    <FaBook />
                  )}
                </button>

                {showStatusSelector && (
                  <div className={styles.statusDropdown}>
                    <div className={styles.statusDropdownHeader}>
                      <span>Status de Leitura</span>
                      <button
                        className={styles.closeDropdown}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowStatusSelector(false);
                        }}
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
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleStatusChange(key);
                            }}
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
            )}
          </div>

          <h3 className={styles.bookTitle}>{livro.titulo}</h3>
          <p className={styles.bookAuthor}>
            por {livro.autor?.nome || livro.autor || 'Autor desconhecido'}
          </p>
          <p className={styles.bookYear}>{livro.anoLancamento}</p>
          <p className={styles.bookDescription}>{livro.descricao}</p>
          <div className={styles.bookDetails}>
            <span className={styles.bookPrice}>
              R$ {livro.mediaPreco || 'Preço não informado'}
            </span>
            <span className={styles.bookPages}>
              {livro.numeroPaginas || 0} páginas
            </span>
          </div>
          {livro.dificuldade && (
            <div className={styles.bookMeta}>
              <span className={styles.difficulty}>
                <FaChartBar /> {livro.dificuldade}
              </span>
              {livro.temAdaptacao && (
                <span className={styles.adaptation}>
                  <FaFilm /> Tem adaptação
                </span>
              )}
            </div>
          )}

          {showReadingStatus && readingStatus && (
            <div className={styles.readingStatus}>
              {(() => {
                const StatusIcon = STATUS_ICONS[readingStatus];
                return (
                  <span 
                    className={styles.statusBadge}
                    style={{ color: STATUS_COLORS[readingStatus] }}
                  >
                    <StatusIcon /> {STATUS_LABELS[readingStatus]}
                  </span>
                );
              })()}
            </div>
          )}

        </div>
      </div>
    </Link>
  );
}
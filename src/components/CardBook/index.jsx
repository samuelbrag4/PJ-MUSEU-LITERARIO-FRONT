import Link from 'next/link';
import { FaChartBar, FaFilm, FaBook, FaBookOpen, FaCheckCircle } from 'react-icons/fa';
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

export default function CardBook({ livro, showReadingStatus = false, onStatusChange = null }) {
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

          {showReadingStatus && livro.statusLeitura && (
            <div className={styles.readingStatus}>
              {(() => {
                const StatusIcon = STATUS_ICONS[livro.statusLeitura];
                return (
                  <span 
                    className={styles.statusBadge}
                    style={{ color: STATUS_COLORS[livro.statusLeitura] }}
                  >
                    <StatusIcon /> {STATUS_LABELS[livro.statusLeitura]}
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
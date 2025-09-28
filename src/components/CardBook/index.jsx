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
            src={livro.imagem || '/livros/default.jpg'} 
            alt={livro.titulo}
            onError={(e) => {
              console.log(`Imagem do livro não encontrada: ${e.target.src}`);
              e.target.style.display = 'none';
              // Criar um placeholder personalizado
              const placeholder = document.createElement('div');
              placeholder.className = styles.imagePlaceholder;
              placeholder.innerHTML = `
                <div style="font-size: 2.5rem; color: #4f8209; margin-bottom: 8px;">📚</div>
                <div style="font-size: 0.8rem; color: #6b8e23; text-align: center; padding: 0 8px; line-height: 1.2;">${livro.titulo}</div>
              `;
              e.target.parentNode.appendChild(placeholder);
            }}
            onLoad={(e) => {
              // Se a imagem carregar com sucesso, remover qualquer placeholder
              const placeholder = e.target.parentNode.querySelector(`.${styles.imagePlaceholder}`);
              if (placeholder) {
                placeholder.remove();
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
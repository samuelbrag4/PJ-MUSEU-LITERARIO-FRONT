import Link from 'next/link';
import { FaChartBar, FaFilm } from 'react-icons/fa';
import styles from './cardBook.module.css';

export default function CardBook({ livro }) {
  if (!livro) return null;

  return (
    <Link href={`/livro/${livro.id}`} className={styles.bookCardLink}>
      <div className={styles.bookCard}>
        <div className={styles.bookImage}>
          <img 
            src={livro.imagem || '/livros/default.jpg'} 
            alt={livro.titulo}
            onError={(e) => {
              e.target.src = '/livros/default.jpg';
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
        </div>
      </div>
    </Link>
  );
}
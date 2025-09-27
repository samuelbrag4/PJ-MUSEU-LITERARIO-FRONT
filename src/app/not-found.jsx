'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './not-found.module.css';

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.errorCode}>404</div>
          <h1 className={styles.title}>Página não encontrada</h1>
          <p className={styles.description}>
            Oops! A página que você está procurando não foi encontrada em nosso Museu Literário.
            Ela pode ter sido removida, renomeada ou talvez nunca tenha existido.
          </p>
          
          <div className={styles.bookIcon}>📚</div>
          
          <div className={styles.actions}>
            <Link href="/home" className={styles.primaryButton}>
              Voltar para Home
            </Link>
            <button onClick={handleGoBack} className={styles.secondaryButton}>
              Página Anterior
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
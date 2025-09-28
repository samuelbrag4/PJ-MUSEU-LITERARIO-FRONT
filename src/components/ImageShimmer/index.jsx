import styles from './imageShimmer.module.css';

export default function ImageShimmer() {
  return (
    <div className={styles.shimmerContainer}>
      <div className={styles.shimmerContent}>
        <div className={styles.shimmerIcon}>📚</div>
        <div className={styles.shimmerText}>Carregando...</div>
      </div>
    </div>
  );
}
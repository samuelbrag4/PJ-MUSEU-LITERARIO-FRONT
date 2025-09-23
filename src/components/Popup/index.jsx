'use client';
import { useEffect } from 'react';
import styles from './popup.module.css';

export default function Popup({ type, message, isVisible, onClose }) {
  useEffect(() => {
    if (isVisible && type !== 'loading') {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close após 3 segundos (exceto para loading)

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, type]);

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.popup} ${styles[type]}`}>
        <div className={styles.icon}>
          {type === 'success' ? '✓' : type === 'loading' ? (
            <div className={styles.spinner}></div>
          ) : '✕'}
        </div>
        <p className={styles.message}>{message}</p>
        {type !== 'loading' && (
          <button 
            className={styles.closeButton}
            onClick={onClose}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
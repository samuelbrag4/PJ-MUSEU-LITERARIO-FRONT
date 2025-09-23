'use client';
import { useEffect } from 'react';
import styles from './popup.module.css';

export default function Popup({ type, message, isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close após 3 segundos

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.popup} ${styles[type]}`}>
        <div className={styles.icon}>
          {type === 'success' ? '✓' : '✕'}
        </div>
        <p className={styles.message}>{message}</p>
        <button 
          className={styles.closeButton}
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
}
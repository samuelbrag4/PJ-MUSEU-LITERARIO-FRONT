'use client';
import { useState, useEffect } from 'react';
import { FaUserPlus, FaUserCheck, FaSpinner } from 'react-icons/fa';
import apiService from '../../services/api';
import styles from './followButton.module.css';

export default function FollowButton({ escritorId, escritorNome, onFollowChange }) {
  const [seguindo, setSeguindo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar se há usuário logado
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      verificarSeguindo();
    } else {
      setLoading(false);
    }
  }, [escritorId]);

  const verificarSeguindo = async () => {
    try {
      setLoading(true);
      const response = await apiService.verificarSeguindo(escritorId);
      setSeguindo(response.segue);
    } catch (error) {
      console.error('Erro ao verificar seguindo:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeguir = async () => {
    if (!user) {
      // Redirecionar para login se não estiver logado
      alert('Você precisa estar logado para seguir escritores!');
      window.location.href = '/';
      return;
    }

    try {
      setActionLoading(true);
      
      if (seguindo) {
        await apiService.deixarDeSeguirEscritor(escritorId);
        setSeguindo(false);
        console.log(`Deixou de seguir ${escritorNome}`);
      } else {
        await apiService.seguirEscritor(escritorId);
        setSeguindo(true);
        console.log(`Começou a seguir ${escritorNome}`);
      }

      // Notificar componente pai sobre a mudança
      if (onFollowChange) {
        onFollowChange(escritorId, !seguindo);
      }
      
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir:', error);
      alert('Erro ao processar ação. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  // Se não há usuário logado, não mostrar o botão
  if (!user) {
    return null;
  }

  // Se ainda está carregando
  if (loading) {
    return (
      <button className={`${styles.followButton} ${styles.loading}`} disabled>
        <FaSpinner className={styles.spinner} />
        Verificando...
      </button>
    );
  }

  return (
    <button 
      className={`${styles.followButton} ${seguindo ? styles.following : styles.notFollowing}`}
      onClick={toggleSeguir}
      disabled={actionLoading}
    >
      {actionLoading ? (
        <>
          <FaSpinner className={styles.spinner} />
          {seguindo ? 'Deixando...' : 'Seguindo...'}
        </>
      ) : seguindo ? (
        <>
          <FaUserCheck />
          Seguindo
        </>
      ) : (
        <>
          <FaUserPlus />
          Seguir
        </>
      )}
    </button>
  );
}
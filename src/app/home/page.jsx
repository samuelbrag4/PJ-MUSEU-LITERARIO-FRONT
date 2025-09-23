'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './home.module.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar se o usuário está logado
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.welcome}>
            <h1 className={styles.title}>Bem-vindo ao Museu Literário!</h1>
            <p className={styles.greeting}>
              Olá, <span className={styles.userName}>{user.nome}</span>! 
              Que bom ter você aqui. 📚
            </p>
          </div>
          
          <div className={styles.userInfo}>
            {user.foto && (
              <img 
                src={`http://localhost:5000${user.foto}`} 
                alt="Foto do usuário" 
                className={styles.userPhoto}
              />
            )}
            <div className={styles.userDetails}>
              <p><strong>Usuário:</strong> @{user.nomeUsuario}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Tipo:</strong> {user.tipo}</p>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.card}>
            <h2>🏛️ Explore o Acervo</h2>
            <p>Descubra centenas de obras literárias brasileiras clássicas e contemporâneas.</p>
            <button className={styles.button}>Ver Livros</button>
          </div>

          <div className={styles.card}>
            <h2>⭐ Seus Favoritos</h2>
            <p>Gerencie sua lista de livros favoritos e acompanhe seu progresso de leitura.</p>
            <button className={styles.button}>Meus Favoritos</button>
          </div>

          <div className={styles.card}>
            <h2>✍️ Perfil</h2>
            <p>Edite suas informações pessoais e defina seu livro destaque.</p>
            <button className={styles.button}>Editar Perfil</button>
          </div>
        </div>

        <footer className={styles.footer}>
          <button 
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            Sair da Conta
          </button>
        </footer>
      </div>
    </main>
  );
}
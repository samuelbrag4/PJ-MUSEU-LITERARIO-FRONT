'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from './home.module.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar se há usuário logado
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      router.push('/');
      return;
    }
    
    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Bem-vindo ao Museu Literário Brasileiro
              {user && <span className={styles.userName}>, {user.nome}!</span>}
            </h1>
            <p className={styles.heroSubtitle}>
              Explore a rica tradição literária do Brasil através de nossa vasta coleção 
              de obras, biografias e análises dos grandes mestres da literatura nacional.
            </p>
            <div className={styles.heroActions}>
              <button className={styles.primaryButton}>
                📚 Explorar Acervo
              </button>
              <button className={styles.secondaryButton}>
                ✍️ Conhecer Escritores
              </button>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.bookAnimation}>📖</div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.stats}>
          <div className={styles.container}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📚</div>
                <div className={styles.statNumber}>2,847</div>
                <div className={styles.statLabel}>Livros Catalogados</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>✍️</div>
                <div className={styles.statNumber}>456</div>
                <div className={styles.statLabel}>Escritores</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>👥</div>
                <div className={styles.statNumber}>12,389</div>
                <div className={styles.statLabel}>Usuários Ativos</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>⭐</div>
                <div className={styles.statNumber}>18,567</div>
                <div className={styles.statLabel}>Avaliações</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Descubra a Literatura Brasileira</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📖</div>
                <h3 className={styles.featureTitle}>Acervo Digital</h3>
                <p className={styles.featureDescription}>
                  Explore nossa vasta coleção de obras digitalizadas, desde clássicos 
                  até autores contemporâneos.
                </p>
                <button className={styles.featureButton}>Explorar Livros</button>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🎭</div>
                <h3 className={styles.featureTitle}>Biografias</h3>
                <p className={styles.featureDescription}>
                  Conheça a vida e obra dos grandes nomes da literatura brasileira 
                  através de biografias detalhadas.
                </p>
                <button className={styles.featureButton}>Ver Escritores</button>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>💭</div>
                <h3 className={styles.featureTitle}>Análises</h3>
                <p className={styles.featureDescription}>
                  Acesse análises críticas e interpretações de especialistas sobre 
                  as principais obras literárias.
                </p>
                <button className={styles.featureButton}>Ler Análises</button>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>❤️</div>
                <h3 className={styles.featureTitle}>Favoritos</h3>
                <p className={styles.featureDescription}>
                  Crie sua biblioteca pessoal salvando suas obras e autores favoritos 
                  para acesso rápido.
                </p>
                <button className={styles.featureButton}>Meus Favoritos</button>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Books Section */}
        <section className={styles.recentBooks}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Livros em Destaque</h2>
            <div className={styles.booksGrid}>
              <div className={styles.bookCard}>
                <div className={styles.bookCover}>📚</div>
                <h3 className={styles.bookTitle}>Dom Casmurro</h3>
                <p className={styles.bookAuthor}>Machado de Assis</p>
                <div className={styles.bookRating}>⭐⭐⭐⭐⭐</div>
              </div>
              
              <div className={styles.bookCard}>
                <div className={styles.bookCover}>📖</div>
                <h3 className={styles.bookTitle}>O Cortiço</h3>
                <p className={styles.bookAuthor}>Aluísio Azevedo</p>
                <div className={styles.bookRating}>⭐⭐⭐⭐⭐</div>
              </div>
              
              <div className={styles.bookCard}>
                <div className={styles.bookCover}>📕</div>
                <h3 className={styles.bookTitle}>Iracema</h3>
                <p className={styles.bookAuthor}>José de Alencar</p>
                <div className={styles.bookRating}>⭐⭐⭐⭐⭐</div>
              </div>
              
              <div className={styles.bookCard}>
                <div className={styles.bookCover}>📗</div>
                <h3 className={styles.bookTitle}>Capitães da Areia</h3>
                <p className={styles.bookAuthor}>Jorge Amado</p>
                <div className={styles.bookRating}>⭐⭐⭐⭐⭐</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <div className={styles.container}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Comece sua Jornada Literária</h2>
              <p className={styles.ctaDescription}>
                Junte-se a milhares de leitores que já descobriram o prazer da literatura brasileira.
              </p>
              <button className={styles.ctaButton}>Explorar Agora</button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
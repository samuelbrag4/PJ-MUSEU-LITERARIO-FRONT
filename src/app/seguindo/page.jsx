'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaUser, 
  FaBook, 
  FaUserFriends,
  FaCalendarAlt,
  FaHeart,
  FaSpinner,
  FaChartBar,
  FaCrown
} from 'react-icons/fa';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FollowButton from '../../components/FollowButton';
import apiService from '../../services/api';
import styles from './seguindo.module.css';

export default function MeusEscritores() {
  const [escritoresSeguindo, setEscritoresSeguindo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [estatisticas, setEstatisticas] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Verificar se há usuário logado
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      carregarEscritoresSeguindo();
      carregarEstatisticas();
    } else {
      // Redirecionar para login se não estiver logado
      router.push('/');
    }
  }, []);

  const carregarEscritoresSeguindo = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMeusEscritores();
      
      if (response.escritores) {
        setEscritoresSeguindo(response.escritores);
      }
    } catch (error) {
      console.error('Erro ao carregar escritores seguindo:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarEstatisticas = async () => {
    try {
      const response = await apiService.getMinhasEstatisticas();
      setEstatisticas(response);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return '';
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    } catch (error) {
      return '';
    }
  };

  const calcularTempoSeguindo = (dataString) => {
    if (!dataString) return '';
    try {
      const dataInicio = new Date(dataString);
      const agora = new Date();
      const diffTime = Math.abs(agora - dataInicio);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Hoje';
      if (diffDays === 1) return 'Há 1 dia';
      if (diffDays < 30) return `Há ${diffDays} dias`;
      
      const diffMonths = Math.floor(diffDays / 30);
      if (diffMonths === 1) return 'Há 1 mês';
      if (diffMonths < 12) return `Há ${diffMonths} meses`;
      
      const diffYears = Math.floor(diffMonths / 12);
      return diffYears === 1 ? 'Há 1 ano' : `Há ${diffYears} anos`;
    } catch (error) {
      return '';
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.loading}>
            <FaSpinner className={styles.spinner} />
            <p>Carregando seus escritores...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Seção de Introdução */}
          <section className={styles.introSection}>
            <div className={styles.introContent}>
              <h1 className={styles.pageTitle}>
                <FaHeart /> Meus Escritores
              </h1>
              <p className={styles.pageDescription}>
                Acompanhe os escritores que você segue e descubra suas mais recentes obras. 
                Mantenha-se conectado com seus autores favoritos da literatura brasileira.
              </p>
            </div>
          </section>

          {/* Estatísticas do usuário */}
          {estatisticas && (
            <section className={styles.statsSection}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <FaUserFriends className={styles.statIcon} />
                  <div className={styles.statInfo}>
                    <h3>{estatisticas.totalSeguindo || escritoresSeguindo.length}</h3>
                    <p>Escritores Seguindo</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <FaBook className={styles.statIcon} />
                  <div className={styles.statInfo}>
                    <h3>{estatisticas.totalLivrosDosEscritores || 0}</h3>
                    <p>Livros dos Seus Escritores</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <FaChartBar className={styles.statIcon} />
                  <div className={styles.statInfo}>
                    <h3>{estatisticas.mediaSeguidoresPorEscritor || 0}</h3>
                    <p>Média de Seguidores</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Lista de escritores seguindo */}
          <section className={styles.writersSection}>
            {escritoresSeguindo.length > 0 ? (
              <>
                <h2 className={styles.sectionTitle}>
                  Escritores que Você Segue ({escritoresSeguindo.length})
                </h2>
                <div className={styles.writersGrid}>
                  {escritoresSeguindo.map(({ escritor, seguidoEm }) => (
                    <div key={escritor.id} className={styles.writerCard}>
                      <div className={styles.writerImage}>
                        <img 
                          src={escritor.foto || '/autores/default.jpg'} 
                          alt={escritor.nome}
                          onError={(e) => {
                            e.target.src = '/autores/default.jpg';
                          }}
                        />
                        {/* Badge para escritores muito seguidos */}
                        {escritor.totalSeguidores > 50 && (
                          <div className={styles.popularBadge}>
                            <FaCrown /> Popular
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.writerInfo}>
                        <Link href={`/autor/${escritor.id}`} className={styles.writerNameLink}>
                          <h3 className={styles.writerName}>{escritor.nome}</h3>
                        </Link>
                        
                        {escritor.biografia && (
                          <p className={styles.writerBio}>
                            {escritor.biografia.length > 120 
                              ? `${escritor.biografia.substring(0, 120)}...` 
                              : escritor.biografia}
                          </p>
                        )}
                        
                        <div className={styles.writerStats}>
                          <span className={styles.bookCount}>
                            <FaBook /> {escritor.totalLivros || 0} obra{(escritor.totalLivros || 0) !== 1 ? 's' : ''}
                          </span>
                          <span className={styles.followersCount}>
                            <FaUserFriends /> {escritor.totalSeguidores || 0} seguidor{(escritor.totalSeguidores || 0) !== 1 ? 'es' : ''}
                          </span>
                        </div>
                        
                        <div className={styles.followInfo}>
                          <FaCalendarAlt />
                          <span>Seguindo desde {calcularTempoSeguindo(seguidoEm)}</span>
                        </div>
                        
                        <div className={styles.writerActions}>
                          <FollowButton 
                            escritorId={escritor.id} 
                            escritorNome={escritor.nome}
                            onFollowChange={(escritorId, seguindo) => {
                              if (!seguindo) {
                                // Remove da lista se deixou de seguir
                                setEscritoresSeguindo(prev => 
                                  prev.filter(item => item.escritor.id !== escritorId)
                                );
                                carregarEstatisticas();
                              }
                            }}
                          />
                          <Link href={`/autor/${escritor.id}`} className={styles.viewProfileButton}>
                            <FaUser /> Ver Perfil
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.noWriters}>
                <FaHeart className={styles.noWritersIcon} />
                <h3>Você ainda não segue nenhum escritor</h3>
                <p>
                  Explore nossa biblioteca de autores brasileiros e comece a seguir 
                  seus escritores favoritos para acompanhar suas obras e novidades.
                </p>
                <Link href="/autores" className={styles.exploreButton}>
                  <FaUser /> Explorar Escritores
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
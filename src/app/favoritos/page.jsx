'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaHeart, 
  FaBook, 
  FaBookOpen, 
  FaCheckCircle,
  FaUser,
  FaChartBar,
  FaFilter,
  FaSpinner,
  FaExclamationTriangle,
  FaRedo
} from 'react-icons/fa';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CardBook from '../../components/CardBook';
import apiService from '../../services/api';
import styles from './favoritos.module.css';

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [escritoresFavoritos, setEscritoresFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [estatisticas, setEstatisticas] = useState({
    queroLer: 0,
    lendo: 0,
    jaLi: 0,
    total: 0
  });
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [filtroGenero, setFiltroGenero] = useState('TODOS');
  const [generos, setGeneros] = useState([]);
  const [favoritosPorGenero, setFavoritosPorGenero] = useState({});

  const router = useRouter();

  useEffect(() => {
    // Verificar autenticação
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      router.push('/');
      return;
    }
    
    setUser(JSON.parse(userData));
    carregarFavoritos();
    carregarEscritoresFavoritos();
  }, []);

  const carregarFavoritos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (filtroStatus !== 'TODOS') {
        params.statusLeitura = filtroStatus;
      }
      if (filtroGenero !== 'TODOS') {
        params.genero = filtroGenero;
      }

      const response = await apiService.getMeusFavoritos(params);
      
      // Processar resposta com diferentes formatos possíveis
      let favoritosData = [];
      let estatisticasData = { queroLer: 0, lendo: 0, jaLi: 0, total: 0 };
      
      if (response && response.favoritos) {
        // Formato esperado com favoritos e estatísticas
        favoritosData = response.favoritos;
        estatisticasData = response.estatisticas || estatisticasData;
      } else if (Array.isArray(response)) {
        // Fallback: resposta é um array direto
        favoritosData = response.map(item => ({
          id: item.id || Math.random(),
          livro: item.livro || item,
          statusLeitura: item.statusLeitura || 'QUERO_LER',
          progresso: item.progresso || 0
        }));
        
        // Calcular estatísticas manualmente
        estatisticasData = favoritosData.reduce((acc, fav) => {
          const status = fav.statusLeitura;
          if (status === 'QUERO_LER') acc.queroLer++;
          else if (status === 'LENDO') acc.lendo++;
          else if (status === 'JA_LI') acc.jaLi++;
          acc.total++;
          return acc;
        }, { queroLer: 0, lendo: 0, jaLi: 0, total: 0 });
      }
      
      setFavoritos(favoritosData);
      setEstatisticas(estatisticasData);
      
      // Organizar por gênero
      const porGenero = {};
      favoritosData.forEach(fav => {
        const genero = fav.livro?.genero || 'Outros';
        if (!porGenero[genero]) {
          porGenero[genero] = [];
        }
        porGenero[genero].push(fav);
      });
      setFavoritosPorGenero(porGenero);
      
      // Extrair gêneros únicos
      const generosUnicos = [...new Set(favoritosData.map(fav => fav.livro?.genero).filter(Boolean))];
      setGeneros(generosUnicos);
      
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      setError('Não foi possível carregar os favoritos. Verifique sua conexão.');
      setFavoritos([]);
      setEstatisticas({ queroLer: 0, lendo: 0, jaLi: 0, total: 0 });
      setFavoritosPorGenero({});
      setGeneros([]);
    } finally {
      setLoading(false);
    }
  };

  const carregarEscritoresFavoritos = async () => {
    try {
      // Assumindo que temos uma rota para escritores seguidos
      const response = await apiService.getMeusEscritores();
      if (response.escritores) {
        setEscritoresFavoritos(response.escritores.slice(0, 5)); // Apenas 5 principais
      }
    } catch (error) {
      console.error('Erro ao carregar escritores favoritos:', error);
    }
  };

  const atualizarStatusLeitura = async (livroId, novoStatus, progresso = 0) => {
    try {
      await apiService.request(`/favoritos/status/${livroId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          statusLeitura: novoStatus,
          progresso: progresso,
          dataInicio: novoStatus === 'LENDO' ? new Date().toISOString().split('T')[0] : null
        })
      });
      
      // Recarregar favoritos
      carregarFavoritos();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'QUERO_LER':
        return <FaBook className={styles.statusIcon} />;
      case 'LENDO':
        return <FaBookOpen className={styles.statusIcon} />;
      case 'JA_LI':
        return <FaCheckCircle className={styles.statusIcon} />;
      default:
        return <FaHeart className={styles.statusIcon} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'QUERO_LER':
        return 'Quero Ler';
      case 'LENDO':
        return 'Lendo';
      case 'JA_LI':
        return 'Já Li';
      default:
        return 'Favorito';
    }
  };

  useEffect(() => {
    // Verificar se o usuário está logado
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      router.push('/');
      return;
    }
    
    carregarFavoritos();
  }, [filtroStatus, filtroGenero, router]);

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.loading}>
          <FaSpinner className={styles.spinner} />
          <span>Carregando seus favoritos...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <FaExclamationTriangle className={styles.errorIcon} />
            <h2>Ops! Algo deu errado</h2>
            <p>{error}</p>
            <button 
              onClick={carregarFavoritos}
              className={styles.retryButton}
            >
              <FaRedo /> Tentar novamente
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Header da Página */}
          <section className={styles.pageHeader}>
            <div className={styles.headerContent}>
              <h1 className={styles.pageTitle}>
                <FaHeart className={styles.titleIcon} />
                Meus Favoritos
              </h1>
              <p className={styles.pageSubtitle}>
                Acompanhe seus livros favoritos e organize sua jornada de leitura
              </p>
            </div>
          </section>

          {/* Estatísticas */}
          <section className={styles.statsSection}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FaBook />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statNumber}>{estatisticas.queroLer}</span>
                  <span className={styles.statLabel}>Quero Ler</span>
                </div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FaBookOpen />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statNumber}>{estatisticas.lendo}</span>
                  <span className={styles.statLabel}>Lendo</span>
                </div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FaCheckCircle />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statNumber}>{estatisticas.jaLi}</span>
                  <span className={styles.statLabel}>Já Li</span>
                </div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FaChartBar />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statNumber}>{estatisticas.total}</span>
                  <span className={styles.statLabel}>Total</span>
                </div>
              </div>
            </div>
          </section>

          {/* Filtros */}
          <section className={styles.filtersSection}>
            <div className={styles.filters}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  <FaFilter /> Status
                </label>
                <select 
                  value={filtroStatus} 
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="TODOS">Todos</option>
                  <option value="QUERO_LER">Quero Ler</option>
                  <option value="LENDO">Lendo</option>
                  <option value="JA_LI">Já Li</option>
                </select>
              </div>
              
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Gênero</label>
                <select 
                  value={filtroGenero} 
                  onChange={(e) => setFiltroGenero(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="TODOS">Todos</option>
                  {generos.map(genero => (
                    <option key={genero} value={genero}>{genero}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Lista de Livros Favoritos */}
          <section className={styles.booksSection}>
            {filtroStatus === 'TODOS' ? (
              // Mostrar por gênero quando não há filtro de status
              Object.keys(favoritosPorGenero).map(genero => (
                <div key={genero} className={styles.genreSection}>
                  <h2 className={styles.genreTitle}>{genero}</h2>
                  <div className={styles.booksGrid}>
                    {favoritosPorGenero[genero].map(favorito => (
                      <div key={favorito.id} className={styles.bookCardWrapper}>
                        <CardBook 
                          livro={{...favorito.livro, statusLeitura: favorito.statusLeitura}} 
                          showReadingStatus={true} 
                        />
                        <div className={styles.bookStatus}>
                          <div className={styles.statusInfo}>
                            {getStatusIcon(favorito.statusLeitura)}
                            <span>{getStatusText(favorito.statusLeitura)}</span>
                          </div>
                          {favorito.progresso > 0 && (
                            <div className={styles.progressBar}>
                              <div 
                                className={styles.progressFill}
                                style={{ width: `${favorito.progresso}%` }}
                              ></div>
                              <span className={styles.progressText}>{favorito.progresso}%</span>
                            </div>
                          )}
                          <select
                            value={favorito.statusLeitura}
                            onChange={(e) => atualizarStatusLeitura(favorito.livro.id, e.target.value)}
                            className={styles.statusSelect}
                          >
                            <option value="QUERO_LER">Quero Ler</option>
                            <option value="LENDO">Lendo</option>
                            <option value="JA_LI">Já Li</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // Mostrar filtrado
              <div className={styles.booksGrid}>
                {favoritos.map(favorito => (
                  <div key={favorito.id} className={styles.bookCardWrapper}>
                    <CardBook 
                      livro={{...favorito.livro, statusLeitura: favorito.statusLeitura}} 
                      showReadingStatus={true} 
                    />
                    <div className={styles.bookStatus}>
                      <div className={styles.statusInfo}>
                        {getStatusIcon(favorito.statusLeitura)}
                        <span>{getStatusText(favorito.statusLeitura)}</span>
                      </div>
                      {favorito.progresso > 0 && (
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill}
                            style={{ width: `${favorito.progresso}%` }}
                          ></div>
                          <span className={styles.progressText}>{favorito.progresso}%</span>
                        </div>
                      )}
                      <select
                        value={favorito.statusLeitura}
                        onChange={(e) => atualizarStatusLeitura(favorito.livro.id, e.target.value)}
                        className={styles.statusSelect}
                      >
                        <option value="QUERO_LER">Quero Ler</option>
                        <option value="LENDO">Lendo</option>
                        <option value="JA_LI">Já Li</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {favoritos.length === 0 && (
              <div className={styles.emptyState}>
                <FaHeart className={styles.emptyIcon} />
                <h3>Nenhum favorito encontrado</h3>
                <p>Comece adicionando livros aos seus favoritos para acompanhar sua jornada de leitura!</p>
              </div>
            )}
          </section>

          {/* Escritores Favoritos */}
          {escritoresFavoritos.length > 0 && (
            <section className={styles.writersSection}>
              <h2 className={styles.sectionTitle}>
                <FaUser /> Escritores que Sigo
              </h2>
              <div className={styles.writersGrid}>
                {escritoresFavoritos.map(escritor => (
                  <div key={escritor.id} className={styles.writerCard}>
                    <img 
                      src={escritor.foto || '/autores/default.jpg'} 
                      alt={escritor.nome}
                      className={styles.writerPhoto}
                      onError={(e) => {
                        e.target.src = '/autores/default.jpg';
                      }}
                    />
                    <div className={styles.writerInfo}>
                      <h3 className={styles.writerName}>{escritor.nome}</h3>
                      <p className={styles.writerBooks}>
                        {escritor.totalLivros || 0} livros
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
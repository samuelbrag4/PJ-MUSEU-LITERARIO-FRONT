'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaUser,
  FaEdit,
  FaCalendarAlt,
  FaBook,
  FaCamera,
  FaUserFriends,
  FaHeart,
  FaPlus,
  FaSave,
  FaTimes,
  FaInfoCircle,
  FaBookOpen,
  FaFileImage,
  FaTrophy,
  FaBullseye,
  FaChartBar,
  FaClock,
  FaStar,
  FaFire,
  FaMedal,
  FaGem,
  FaCrown,
  FaQuoteRight,
  FaHistory,
  FaChartPie,
  FaAward,
  FaBookmark
} from 'react-icons/fa';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import FollowingModal from '../../../components/FollowingModal';
import CronogramaLeitura from '../../../components/CronogramaLeitura';
import apiService from '../../../services/api';
import styles from './profile.module.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddBook, setShowAddBook] = useState(false);
  const [socialStats, setSocialStats] = useState({
    seguindo: 0,
    seguidores: 0,
    livrosFavoritos: 0
  });
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showCronograma, setShowCronograma] = useState(false);
  const [estatisticasLeitura, setEstatisticasLeitura] = useState({
    queroLer: 0,
    lendo: 0,
    jaLi: 0,
    total: 0
  });
  const [newBook, setNewBook] = useState({
    titulo: '',
    anoLancamento: '',
    descricao: '',
    mediaPreco: '',
    imagem: '',
    genero: '',
    dificuldade: '',
    temAdaptacao: false,
    numeroPaginas: ''
  });

  // Novos estados para funcionalidades expandidas
  const [metaAnual, setMetaAnual] = useState(12); // Meta padrão de 12 livros/ano
  const [editingMeta, setEditingMeta] = useState(false);
  const [bio, setBio] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const [badges, setBadges] = useState([]);
  const [atividadesRecentes, setAtividadesRecentes] = useState([]);
  const [progressoMensal, setProgressoMensal] = useState({
    janeiro: 0, fevereiro: 0, marco: 0, abril: 0,
    maio: 0, junho: 0, julho: 0, agosto: 0,
    setembro: 0, outubro: 0, novembro: 0, dezembro: 0
  });

  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  // Recalcular badges e atividades quando os dados mudarem
  useEffect(() => {
    if (user && estatisticasLeitura) {
      calculateBadges(user);
      generateRecentActivities(user);
    }
  }, [user, estatisticasLeitura, books]);

  const loadSocialStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const meusEscritores = await apiService.getMeusEscritores();
      
      let seguidoresCount = 0;
      
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser && currentUser.tipo === 'ESCRITOR') {
        try {
          const seguidoresResponse = await apiService.getSeguidoresEscritor(currentUser.id);
          seguidoresCount = seguidoresResponse.totalSeguidores || 0;
        } catch (error) {
          console.error('Erro ao carregar seguidores do escritor:', error);
        }
      }
      
      setSocialStats({
        seguindo: meusEscritores.escritores?.length || 0,
        seguidores: seguidoresCount,
        livrosFavoritos: 0
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas sociais:', error);
    }
  };

  const loadEstatisticasLeitura = async () => {
    try {
      const response = await apiService.getMeusFavoritos();
      if (response.estatisticas) {
        setEstatisticasLeitura(response.estatisticas);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas de leitura:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!userData || !token) {
        router.push('/');
        return;
      }

      if (!apiService.isTokenValid()) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
        return;
      }

      const currentUser = JSON.parse(userData);
      setUser(currentUser);
      setEditData(currentUser);
      
      // Carregar bio se existir
      setBio(currentUser.biografia || '');

      if (currentUser.tipo === 'ESCRITOR') {
        loadAuthorBooks(currentUser.id);
      }

      loadSocialStats();
      loadEstatisticasLeitura();
      
      // Calcular badges e atividades com base nos dados
      calculateBadges(currentUser);
      generateRecentActivities(currentUser);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar perfil do usuário');
    } finally {
      setLoading(false);
    }
  };

  // Calcular badges baseado nos dados existentes
  const calculateBadges = (userData) => {
    const userBadges = [];
    
    // Badge de Novo Usuário
    userBadges.push({
      id: 'novo-usuario',
      nome: 'Novo Membro',
      descricao: 'Bem-vindo ao Museu Literário!',
      icone: FaGem,
      cor: '#28a745',
      desbloqueado: true
    });

    // Badge baseado no tipo de usuário
    if (userData.tipo === 'ESCRITOR') {
      userBadges.push({
        id: 'escritor',
        nome: 'Escritor Oficial',
        descricao: 'Autor publicado na plataforma',
        icone: FaCrown,
        cor: '#ffd700',
        desbloqueado: true
      });
    }

    // Badge baseado na idade (experiência de vida)
    if (userData.idade >= 50) {
      userBadges.push({
        id: 'sabedoria',
        nome: 'Sábio Literário',
        descricao: 'Experiência de vida em literatura',
        icone: FaMedal,
        cor: '#8b4513',
        desbloqueado: true
      });
    }

    // Badge baseado nos dados de leitura
    if (estatisticasLeitura.total >= 10) {
      userBadges.push({
        id: 'leitor-ativo',
        nome: 'Leitor Ativo',
        descricao: 'Mais de 10 livros na biblioteca',
        icone: FaFire,
        cor: '#ff4444',
        desbloqueado: true
      });
    }

    if (estatisticasLeitura.jaLi >= 5) {
      userBadges.push({
        id: 'completador',
        nome: 'Completador',
        descricao: '5+ livros concluídos',
        icone: FaAward,
        cor: '#007bff',
        desbloqueado: true
      });
    }

    setBadges(userBadges);
  };

  // Gerar atividades recentes simuladas
  const generateRecentActivities = (userData) => {
    const atividades = [];
    const hoje = new Date();

    // Atividade de cadastro
    atividades.push({
      id: 1,
      tipo: 'cadastro',
      titulo: 'Conta criada',
      descricao: `Bem-vindo(a), ${userData.nome}!`,
      data: new Date(hoje.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      icone: FaUser
    });

    // Se for escritor, atividade de livros
    if (userData.tipo === 'ESCRITOR' && books.length > 0) {
      atividades.push({
        id: 2,
        tipo: 'livro',
        titulo: 'Livros publicados',
        descricao: `${books.length} obra(s) adicionada(s) à biblioteca`,
        data: new Date(hoje.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        icone: FaBook
      });
    }

    // Atividade de metas
    atividades.push({
      id: 3,
      tipo: 'meta',
      titulo: 'Meta de leitura',
      descricao: `Meta atual: ${metaAnual} livros em 2025`,
      data: new Date(hoje.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000),
      icone: FaBullseye
    });

    setAtividadesRecentes(atividades.sort((a, b) => b.data - a.data));
  };

  const loadAuthorBooks = async (authorId) => {
    try {
      setLoadingBooks(true);
      const response = await apiService.getAuthorBooks(authorId);
      setBooks(response.livros || []);
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
    } finally {
      setLoadingBooks(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.updateUserProfile(user.id, editData);
      setUser(response.usuario);
      localStorage.setItem('user', JSON.stringify(response.usuario));
      setEditing(false);
      setSuccess('Perfil atualizado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError('Erro ao atualizar perfil: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await apiService.uploadProfilePhoto(formData);
      setUser({ ...user, foto: response.fotoUrl });
      setSuccess('Foto atualizada com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setError('Erro ao atualizar foto: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const bookData = {
        ...newBook,
        autorId: user.id,
        anoLancamento: parseInt(newBook.anoLancamento),
        mediaPreco: parseFloat(newBook.mediaPreco),
        numeroPaginas: parseInt(newBook.numeroPaginas)
      };

      await apiService.addBook(bookData);
      setNewBook({
        titulo: '',
        anoLancamento: '',
        descricao: '',
        mediaPreco: '',
        imagem: '',
        genero: '',
        dificuldade: '',
        temAdaptacao: false,
        numeroPaginas: ''
      });
      setShowAddBook(false);
      loadAuthorBooks(user.id);
      setSuccess('Livro adicionado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erro ao adicionar livro:', error);
      setError('Erro ao adicionar livro: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.loading}>Carregando perfil...</div>
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
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          {/* Hero Section do Perfil */}
          <section className={styles.heroSection}>
            <div className={styles.heroContent}>
              {/* Imagem do Perfil */}
              <div className={styles.profileImageContainer}>
                <div className={styles.profileImageWrapper}>
                  {user.foto ? (
                    <img 
                      src={user.foto} 
                      alt={user.nome}
                      className={styles.profileImage}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <FaUser size={80} />
                      <span>Sem foto</span>
                    </div>
                  )}
                  
                  <button 
                    className={styles.photoUploadButton}
                    onClick={() => document.getElementById('photoInput').click()}
                  >
                    <FaCamera />
                  </button>
                  <input
                    id="photoInput"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className={styles.photoUploadInput}
                  />
                </div>
              </div>

              {/* Informações Principais */}
              <div className={styles.profileMainInfo}>
                <div className={styles.profileHeader}>
                  <h1 className={styles.profileTitle}>{user.nome}</h1>
                  <p className={styles.profileSubtitle}>@{user.nomeUsuario}</p>
                  <div className={styles.profileBadge}>
                    {user.tipo === 'ESCRITOR' ? 'Escritor' : 'Leitor'}
                  </div>
                </div>

                {/* Estatísticas Principais */}
                <div className={styles.statsContainer}>
                  <div className={styles.statsGrid}>
                    <div 
                      className={styles.statCard}
                      onClick={() => setShowFollowingModal(true)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className={styles.statNumber}>{socialStats.seguindo}</span>
                      <span className={styles.statLabel}>Seguindo</span>
                    </div>
                    
                    {user.tipo === 'ESCRITOR' && (
                      <div className={styles.statCard}>
                        <span className={styles.statNumber}>{socialStats.seguidores}</span>
                        <span className={styles.statLabel}>Seguidores</span>
                      </div>
                    )}
                    
                    <div className={styles.statCard}>
                      <span className={styles.statNumber}>{books.length}</span>
                      <span className={styles.statLabel}>{user.tipo === 'ESCRITOR' ? 'Livros' : 'Favoritos'}</span>
                    </div>
                  </div>

                  {/* Estatísticas de Leitura */}
                  <div className={styles.readingStatsSection}>
                    <h3 className={styles.readingStatsTitle}>
                      <FaBookOpen />
                      Estatísticas de Leitura
                    </h3>
                    <div className={styles.readingStatsGrid}>
                      <div className={styles.readingStat}>
                        <span className={styles.readingStatNumber}>{estatisticasLeitura.queroLer}</span>
                        <span className={styles.readingStatLabel}>Quero Ler</span>
                      </div>
                      <div className={styles.readingStat}>
                        <span className={styles.readingStatNumber}>{estatisticasLeitura.lendo}</span>
                        <span className={styles.readingStatLabel}>Lendo</span>
                      </div>
                      <div className={styles.readingStat}>
                        <span className={styles.readingStatNumber}>{estatisticasLeitura.jaLi}</span>
                        <span className={styles.readingStatLabel}>Já Li</span>
                      </div>
                      <div className={styles.readingStat}>
                        <span className={styles.readingStatNumber}>{estatisticasLeitura.total}</span>
                        <span className={styles.readingStatLabel}>Total</span>
                      </div>
                    </div>
                    
                    <button 
                      className={styles.cronogramaButton}
                      onClick={() => setShowCronograma(true)}
                    >
                      <FaCalendarAlt />
                      Cronograma de Leitura
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Seção de Metas de Leitura */}
          <section className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <FaBullseye className={styles.sectionIcon} />
                Metas de Leitura 2025
              </h2>
            </div>

            <div className={styles.metaContainer}>
              <div className={styles.metaDisplay}>
                <div className={styles.metaInfo}>
                  <div className={styles.metaNumber}>{metaAnual}</div>
                  <div className={styles.metaLabel}>Livros em 2025</div>
                </div>
                
                <div className={styles.progressoMeta}>
                  <div className={styles.progressoBar}>
                    <div 
                      className={styles.progressoFill}
                      style={{ 
                        width: `${Math.min((estatisticasLeitura.jaLi / metaAnual) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <div className={styles.progressoTexto}>
                    {estatisticasLeitura.jaLi} de {metaAnual} livros concluídos
                    ({Math.round((estatisticasLeitura.jaLi / metaAnual) * 100)}%)
                  </div>
                </div>

                <button 
                  className={styles.editMetaButton}
                  onClick={() => setEditingMeta(!editingMeta)}
                >
                  <FaEdit />
                  {editingMeta ? 'Cancelar' : 'Editar Meta'}
                </button>

                {editingMeta && (
                  <div className={styles.editMetaForm}>
                    <input
                      type="number"
                      value={metaAnual}
                      onChange={(e) => setMetaAnual(parseInt(e.target.value) || 1)}
                      min="1"
                      max="365"
                      className={styles.metaInput}
                    />
                    <button 
                      onClick={() => {
                        setEditingMeta(false);
                        setSuccess('Meta atualizada com sucesso!');
                        setTimeout(() => setSuccess(''), 3000);
                      }}
                      className={styles.saveMetaButton}
                    >
                      <FaSave />
                      Salvar
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.metaInsights}>
                <div className={styles.insight}>
                  <FaChartBar className={styles.insightIcon} />
                  <div>
                    <div className={styles.insightTitle}>Ritmo Atual</div>
                    <div className={styles.insightValue}>
                      {Math.round((estatisticasLeitura.jaLi / 9) * 12)} livros/ano
                    </div>
                  </div>
                </div>
                
                <div className={styles.insight}>
                  <FaClock className={styles.insightIcon} />
                  <div>
                    <div className={styles.insightTitle}>Restam</div>
                    <div className={styles.insightValue}>
                      {Math.max(metaAnual - estatisticasLeitura.jaLi, 0)} livros
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Seção de Badges/Conquistas */}
          <section className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <FaTrophy className={styles.sectionIcon} />
                Conquistas
              </h2>
            </div>

            <div className={styles.badgesGrid}>
              {badges.map(badge => (
                <div key={badge.id} className={styles.badgeCard}>
                  <div className={styles.badgeIcon} style={{ color: badge.cor }}>
                    <badge.icone size={24} />
                  </div>
                  <div className={styles.badgeInfo}>
                    <h4 className={styles.badgeName}>{badge.nome}</h4>
                    <p className={styles.badgeDescription}>{badge.descricao}</p>
                  </div>
                  {badge.desbloqueado && (
                    <div className={styles.badgeDesbloqueado}>
                      <FaStar />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Seção de Bio/Descrição */}
          <section className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <FaQuoteRight className={styles.sectionIcon} />
                Sobre Mim
              </h2>
            </div>

            {!editingBio ? (
              <div className={styles.bioDisplay}>
                {bio ? (
                  <p className={styles.bioText}>{bio}</p>
                ) : (
                  <p className={styles.noBio}>
                    Adicione uma descrição sobre você e seus gostos literários...
                  </p>
                )}
                
                <button 
                  className={styles.editButton}
                  onClick={() => setEditingBio(true)}
                >
                  <FaEdit />
                  {bio ? 'Editar Bio' : 'Adicionar Bio'}
                </button>
              </div>
            ) : (
              <div className={styles.bioEditForm}>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Conte um pouco sobre você, seus gêneros favoritos, autores preferidos..."
                  className={styles.bioTextarea}
                  maxLength={500}
                />
                <div className={styles.bioCharCount}>
                  {bio.length}/500 caracteres
                </div>
                <div className={styles.formButtons}>
                  <button 
                    onClick={() => {
                      setEditingBio(false);
                      setSuccess('Bio atualizada com sucesso!');
                      setTimeout(() => setSuccess(''), 3000);
                    }}
                    className={styles.saveButton}
                  >
                    <FaSave />
                    Salvar
                  </button>
                  <button 
                    onClick={() => setEditingBio(false)}
                    className={styles.cancelButton}
                  >
                    <FaTimes />
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Seção de Atividades Recentes */}
          <section className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <FaHistory className={styles.sectionIcon} />
                Atividades Recentes
              </h2>
            </div>

            <div className={styles.atividadesTimeline}>
              {atividadesRecentes.map(atividade => (
                <div key={atividade.id} className={styles.atividadeItem}>
                  <div className={styles.atividadeIcon}>
                    <atividade.icone />
                  </div>
                  <div className={styles.atividadeContent}>
                    <h4 className={styles.atividadeTitulo}>{atividade.titulo}</h4>
                    <p className={styles.atividadeDescricao}>{atividade.descricao}</p>
                    <span className={styles.atividadeData}>
                      {atividade.data.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Gráfico Visual Simples de Progresso */}
          <section className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <FaChartPie className={styles.sectionIcon} />
                Distribuição de Leitura
              </h2>
            </div>

            <div className={styles.chartContainer}>
              <div className={styles.chartItem}>
                <div className={styles.chartBar}>
                  <div 
                    className={styles.chartFill} 
                    style={{ 
                      width: `${(estatisticasLeitura.queroLer / estatisticasLeitura.total) * 100 || 0}%`,
                      backgroundColor: '#ffc107'
                    }}
                  ></div>
                </div>
                <div className={styles.chartLabel}>
                  <span>Quero Ler</span>
                  <span>{estatisticasLeitura.queroLer}</span>
                </div>
              </div>

              <div className={styles.chartItem}>
                <div className={styles.chartBar}>
                  <div 
                    className={styles.chartFill} 
                    style={{ 
                      width: `${(estatisticasLeitura.lendo / estatisticasLeitura.total) * 100 || 0}%`,
                      backgroundColor: '#007bff'
                    }}
                  ></div>
                </div>
                <div className={styles.chartLabel}>
                  <span>Lendo</span>
                  <span>{estatisticasLeitura.lendo}</span>
                </div>
              </div>

              <div className={styles.chartItem}>
                <div className={styles.chartBar}>
                  <div 
                    className={styles.chartFill} 
                    style={{ 
                      width: `${(estatisticasLeitura.jaLi / estatisticasLeitura.total) * 100 || 0}%`,
                      backgroundColor: '#28a745'
                    }}
                  ></div>
                </div>
                <div className={styles.chartLabel}>
                  <span>Já Li</span>
                  <span>{estatisticasLeitura.jaLi}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Informações Pessoais */}
          <section className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <FaInfoCircle className={styles.sectionIcon} />
                Informações Pessoais
              </h2>
            </div>

            {!editing ? (
              <>
                <button 
                  className={styles.editButton}
                  onClick={() => setEditing(true)}
                >
                  <FaEdit />
                  Editar Informações
                </button>
                
                <div className={styles.infoDisplay}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Nome Completo</div>
                    <div className={styles.infoValue}>{user.nome}</div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Nome de Usuário</div>
                    <div className={styles.infoValue}>@{user.nomeUsuario}</div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>E-mail</div>
                    <div className={styles.infoValue}>{user.email}</div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Idade</div>
                    <div className={styles.infoValue}>{user.idade} anos</div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Ano de Nascimento</div>
                    <div className={styles.infoValue}>{user.nascimento}</div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Tipo de Conta</div>
                    <div className={styles.infoValue}>
                      {user.tipo === 'ESCRITOR' ? 'Escritor' : 'Usuário Normal'}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <form onSubmit={handleEditSubmit} className={styles.editForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nome Completo</label>
                  <input
                    type="text"
                    value={editData.nome || ''}
                    onChange={(e) => setEditData({...editData, nome: e.target.value})}
                    className={styles.formInput}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nome de Usuário</label>
                  <input
                    type="text"
                    value={editData.nomeUsuario || ''}
                    onChange={(e) => setEditData({...editData, nomeUsuario: e.target.value})}
                    className={styles.formInput}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>E-mail</label>
                  <input
                    type="email"
                    value={editData.email || ''}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className={styles.formInput}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Idade</label>
                  <input
                    type="number"
                    value={editData.idade || ''}
                    onChange={(e) => setEditData({...editData, idade: parseInt(e.target.value)})}
                    className={styles.formInput}
                    min="1"
                    max="120"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Ano de Nascimento</label>
                  <input
                    type="number"
                    value={editData.nascimento || ''}
                    onChange={(e) => setEditData({...editData, nascimento: parseInt(e.target.value)})}
                    className={styles.formInput}
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div className={styles.formButtons}>
                  <button type="submit" className={styles.saveButton}>
                    <FaSave />
                    Salvar
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setEditing(false)}
                    className={styles.cancelButton}
                  >
                    <FaTimes />
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Seção de Livros */}
          {user.tipo === 'ESCRITOR' && (
            <section className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <FaBook className={styles.sectionIcon} />
                  Meus Livros
                </h2>
              </div>

              <button 
                className={styles.addBookButton}
                onClick={() => setShowAddBook(!showAddBook)}
              >
                <FaPlus />
                {showAddBook ? 'Cancelar' : 'Adicionar Novo Livro'}
              </button>

              {showAddBook && (
                <form onSubmit={handleAddBook} className={styles.editForm}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Título</label>
                    <input
                      type="text"
                      value={newBook.titulo}
                      onChange={(e) => setNewBook({...newBook, titulo: e.target.value})}
                      className={styles.formInput}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Ano de Lançamento</label>
                    <input
                      type="number"
                      value={newBook.anoLancamento}
                      onChange={(e) => setNewBook({...newBook, anoLancamento: e.target.value})}
                      className={styles.formInput}
                      min="1000"
                      max={new Date().getFullYear() + 10}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Gênero</label>
                    <input
                      type="text"
                      value={newBook.genero}
                      onChange={(e) => setNewBook({...newBook, genero: e.target.value})}
                      className={styles.formInput}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Número de Páginas</label>
                    <input
                      type="number"
                      value={newBook.numeroPaginas}
                      onChange={(e) => setNewBook({...newBook, numeroPaginas: e.target.value})}
                      className={styles.formInput}
                      min="1"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preço Médio (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newBook.mediaPreco}
                      onChange={(e) => setNewBook({...newBook, mediaPreco: e.target.value})}
                      className={styles.formInput}
                      min="0"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>URL da Imagem</label>
                    <input
                      type="url"
                      value={newBook.imagem}
                      onChange={(e) => setNewBook({...newBook, imagem: e.target.value})}
                      className={styles.formInput}
                      placeholder="https://..."
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Descrição</label>
                    <textarea
                      value={newBook.descricao}
                      onChange={(e) => setNewBook({...newBook, descricao: e.target.value})}
                      className={styles.formTextarea}
                      placeholder="Descreva o livro..."
                      required
                    />
                  </div>

                  <div className={styles.formButtons}>
                    <button type="submit" className={styles.saveButton}>
                      <FaSave />
                      Adicionar Livro
                    </button>
                  </div>
                </form>
              )}

              {loadingBooks ? (
                <div className={styles.loading}>Carregando livros...</div>
              ) : books.length > 0 ? (
                <div className={styles.booksGrid}>
                  {books.map(book => (
                    <div key={book.id} className={styles.bookCard}>
                      {book.imagem && (
                        <img 
                          src={book.imagem} 
                          alt={book.titulo}
                          className={styles.bookImage}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <h4 className={styles.bookTitle}>{book.titulo}</h4>
                      <div className={styles.bookInfo}>
                        <FaCalendarAlt /> {book.anoLancamento}
                      </div>
                      <div className={styles.bookInfo}>
                        <FaBook /> {book.genero}
                      </div>
                      {book.numeroPaginas && (
                        <div className={styles.bookInfo}>
                          <FaFileImage /> {book.numeroPaginas} páginas
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noBooks}>
                  <p>Você ainda não publicou nenhum livro.</p>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {/* Modais */}
      {showFollowingModal && (
        <FollowingModal 
          isOpen={showFollowingModal}
          onClose={() => setShowFollowingModal(false)}
        />
      )}

      {showCronograma && (
        <CronogramaLeitura 
          isOpen={showCronograma}
          onClose={() => setShowCronograma(false)}
        />
      )}

      <Footer />
    </>
  );
}

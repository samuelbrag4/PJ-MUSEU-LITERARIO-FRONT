"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FaExclamationTriangle,
  FaCalendarAlt,
  FaBook,
  FaBookOpen,
  FaUsers,
  FaHeart,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaTrophy,
  FaQuoteLeft,
  FaShare,
  FaStar,
  FaUser,
} from "react-icons/fa";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import CardBook from "../../../components/CardBook";
import FollowButton from "../../../components/FollowButton";
import apiService from "../../../services/api";
import styles from "./autor.module.css";

export default function AutorPage() {
  const [autor, setAutor] = useState(null);
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seguidores, setSeguidores] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const router = useRouter();
  const params = useParams();
  const autorId = params.id;

  useEffect(() => {
    if (autorId) {
      carregarAutor();
      carregarSeguidores();
    }
  }, [autorId]);

  const carregarSeguidores = async () => {
    try {
      const response = await apiService.getSeguidoresEscritor(autorId);
      setSeguidores(response.totalSeguidores || 0);
    } catch (error) {
      console.error("Erro ao carregar seguidores:", error);
      setSeguidores(Math.floor(Math.random() * 5000) + 1000); // Mock data
    }
  };

  const carregarAutor = async () => {
    try {
      setLoading(true);
      setError(null);

      // Tentar buscar dados do autor específico
      try {
        const response = await fetch(`http://localhost:5000/escritores/${autorId}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setAutor(data);
            setLivros(data.livros || []);
            return;
          }
        }
      } catch (error) {
        console.log('Endpoint específico não disponível, usando fallback...');
      }

      // Fallback: buscar todos os escritores e filtrar pelo ID
      const todosEscritoresResponse = await fetch('http://localhost:5000/escritores');
      
      if (!todosEscritoresResponse.ok) {
        setError('Erro ao carregar dados dos autores.');
        return;
      }

      const todosEscritores = await todosEscritoresResponse.json();
      const escritores = Array.isArray(todosEscritores) ? todosEscritores : (todosEscritores.value || []);
      
      const autorEncontrado = escritores.find(escritor => escritor.id === parseInt(autorId));
      
      if (autorEncontrado) {
        setAutor(autorEncontrado);
        setLivros(autorEncontrado.livros || []);
      } else {
        setError('Autor não encontrado.');
      }
      
    } catch (error) {
      console.error('Erro ao carregar autor:', error);
      setError('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setSeguidores((prev) => (isFollowing ? prev - 1 : prev + 1));
  };

  const calcularIdade = (dataNascimento, dataFalecimento) => {
    if (!dataNascimento) return null;
    const nascimento = new Date(dataNascimento);
    const fim = dataFalecimento ? new Date(dataFalecimento) : new Date();

    let idade = fim.getFullYear() - nascimento.getFullYear();
    const mesAtual = fim.getMonth();
    const mesNascimento = nascimento.getMonth();

    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && fim.getDate() < nascimento.getDate())) {
      idade--;
    }

    return idade;
  };

  const formatarData = (data) => {
    if (!data) return null;
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.loading}>Carregando autor...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.error}>
              <h2><FaExclamationTriangle /> {error}</h2>
              <button 
                className={styles.backButton}
                onClick={() => router.back()}
              >
                Voltar
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!autor) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.error}>
              <h2><FaExclamationTriangle /> Autor não encontrado</h2>
              <button 
                className={styles.backButton}
                onClick={() => router.back()}
              >
                Voltar
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const idade = autor.dataNascimento ? calcularIdade(autor.dataNascimento, autor.dataFalecimento) : null;
  const isVivo = !autor.dataFalecimento;

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Botão Voltar */}
          <button 
            className={styles.backButton}
            onClick={() => router.back()}
          >
            ← Voltar aos Autores
          </button>

          {/* Hero Section do Autor */}
          <section className={styles.heroSection}>
            <div className={styles.heroContent}>
              {/* Imagem do Autor */}
              <div className={styles.authorImageContainer}>
                <div className={styles.authorImageWrapper}>
                  <img 
                    src={autor.foto || '/autores/default.jpg'} 
                    alt={autor.nome}
                    className={styles.authorImage}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className={styles.imagePlaceholder}>
                    <FaUser size={60} color="#4f8209" />
                    <span>Sem foto</span>
                  </div>
                </div>
              </div>

              {/* Informações Principais */}
              <div className={styles.authorMainInfo}>
                <div className={styles.authorHeader}>
                  <h1 className={styles.authorTitle}>{autor.nome}</h1>
                  
                  <div className={styles.authorQuote}>
                    <FaQuoteLeft className={styles.quoteIcon} />
                    <p>"{autor.biografia || 'Um grande escritor da literatura brasileira.'}"</p>
                  </div>
                </div>

                {/* Meta Informações */}
                <div className={styles.authorMeta}>
                  <div className={styles.metaGrid}>
                    {autor.dataNascimento && (
                      <div className={styles.metaItem}>
                        <FaCalendarAlt className={styles.metaIcon} />
                        <div>
                          <span className={styles.metaLabel}>Nascimento</span>
                          <span className={styles.metaValue}>
                            {formatarData(autor.dataNascimento)}
                            {idade && ` (${idade} anos${isVivo ? '' : ' quando faleceu'})`}
                          </span>
                        </div>
                      </div>
                    )}

                    {autor.dataFalecimento && (
                      <div className={styles.metaItem}>
                        <FaCalendarAlt className={styles.metaIcon} />
                        <div>
                          <span className={styles.metaLabel}>Falecimento</span>
                          <span className={styles.metaValue}>
                            {formatarData(autor.dataFalecimento)}
                          </span>
                        </div>
                      </div>
                    )}

                    {autor.email && (
                      <div className={styles.metaItem}>
                        <FaUser className={styles.metaIcon} />
                        <div>
                          <span className={styles.metaLabel}>Email</span>
                          <span className={styles.metaValue}>{autor.email}</span>
                        </div>
                      </div>
                    )}

                    <div className={styles.metaItem}>
                      <FaBook className={styles.metaIcon} />
                      <div>
                        <span className={styles.metaLabel}>Obras</span>
                        <span className={styles.metaValue}>
                          {livros.length} {livros.length === 1 ? 'obra' : 'obras'}
                        </span>
                      </div>
                    </div>

                    <div className={styles.metaItem}>
                      <FaUsers className={styles.metaIcon} />
                      <div>
                        <span className={styles.metaLabel}>Seguidores</span>
                        <span className={styles.metaValue}>
                          {seguidores} {seguidores === 1 ? 'seguidor' : 'seguidores'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão de Seguir */}
                <div className={styles.authorActions}>
                  <FollowButton 
                    escritorId={parseInt(autorId)} 
                    onFollowChange={carregarSeguidores}
                  />
                  
                  <button className={styles.shareButton}>
                    <FaShare />
                    Compartilhar
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Seção de Biografia Detalhada */}
          {autor.biografia && (
            <section className={styles.biographySection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <FaBookOpen className={styles.sectionIcon} />
                  Biografia
                </h2>
              </div>
              <div className={styles.biographyContent}>
                <p className={styles.biographyText}>{autor.biografia}</p>
              </div>
            </section>
          )}

          {/* Obras do Autor */}
          <section className={styles.worksSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <FaBook className={styles.sectionIcon} />
                Obras de {autor.nome}
              </h2>
              <span className={styles.worksCount}>
                {livros.length} {livros.length === 1 ? 'obra' : 'obras'}
              </span>
            </div>
            
            {livros.length > 0 ? (
              <div className={styles.booksGrid}>
                {livros.map(livro => (
                  <CardBook key={livro.id} livro={livro} />
                ))}
              </div>
            ) : (
              <div className={styles.noBooks}>
                <p>Este autor ainda não possui obras cadastradas em nossa plataforma.</p>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
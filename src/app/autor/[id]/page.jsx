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
  const [showFullBio, setShowFullBio] = useState(false);

  const router = useRouter();
  const params = useParams();
  const autorId = params.id;

  // Dados mock para demonstração
  const mockAuthorData = {
    id: 1,
    nome: "Machado de Assis",
    biografia:
      "Joaquim Maria Machado de Assis foi um escritor brasileiro, considerado por muitos críticos, estudiosos, escritores e leitores um dos maiores senão o maior nome da literatura do Brasil. Escreveu em praticamente todos os gêneros literários, sendo poeta, romancista, cronista, dramaturgo, contista, folhetinista, jornalista e crítico literário. Testemunhou a Abolição da Escravatura e a mudança política na passagem do Império para a República, e foi um grande comentador e relator dos eventos político-sociais de sua época.",
    nascimento: "21 de junho de 1839",
    morte: "29 de setembro de 1908",
    localNascimento: "Rio de Janeiro, RJ",
    nacionalidade: "Brasileira",
    movimentoLiterario: "Realismo, Naturalismo",
    profissao: "Escritor, Jornalista, Crítico Literário",
    premios: [
      "Fundador da Academia Brasileira de Letras",
      "Primeiro presidente da Academia Brasileira de Letras",
      "Considerado o maior escritor brasileiro",
    ],
    citacoesFamosas: [
      "Capitu deu-me as costas, voltando-se para o espelhinho.",
      "O melhor da festa é prepará-la.",
      "A vida é uma ópera e uma grande ópera.",
      "Cada pessoa é uma raça.",
    ],
    curiosidades: [
      "Era epiléptico e gago na infância",
      "Autodidata, aprendeu francês, inglês e alemão",
      "Trabalhou como tipógrafo antes de se tornar escritor famoso",
      "Foi casado com Carolina Xavier por 35 anos",
    ],
    influencias: [
      "José de Alencar",
      "Manuel Antônio de Almeida",
      "Literatura Francesa",
    ],
    obrasPrincipais: [
      { titulo: "Dom Casmurro", ano: 1899, tipo: "Romance" },
      { titulo: "Memórias Póstumas de Brás Cubas", ano: 1881, tipo: "Romance" },
      { titulo: "O Cortiço", ano: 1890, tipo: "Romance" },
      { titulo: "Quincas Borba", ano: 1891, tipo: "Romance" },
    ],
  };

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

      // Simular API call
      setTimeout(() => {
        setAutor(mockAuthorData);
        setLivros(mockAuthorData.obrasPrincipais);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Erro ao carregar autor:", error);
      setError("Erro ao carregar informações do autor");
      setLoading(false);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setSeguidores((prev) => (isFollowing ? prev - 1 : prev + 1));
  };

  const shareAuthor = () => {
    if (navigator.share) {
      navigator.share({
        title: autor?.nome,
        text: `Conheça a obra de ${autor?.nome}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando informações do autor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <FaExclamationTriangle className={styles.errorIcon} />
        <h2>Erro ao carregar</h2>
        <p>{error}</p>
        <button onClick={() => router.back()}>Voltar</button>
      </div>
    );
  }

  if (!autor) {
    return (
      <div className={styles.errorContainer}>
        <h2>Autor não encontrado</h2>
        <button onClick={() => router.back()}>Voltar</button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.main}>
        {/* Hero Section do Autor */}
        <section className={styles.authorHero}>
          <div className={styles.container}>
            <div className={styles.authorInfo}>
              <div className={styles.authorPhoto}>
                <div className={styles.photoPlaceholder}>
                  <span className={styles.authorInitials}>
                    {autor.nome
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                </div>
              </div>

              <div className={styles.authorDetails}>
                <h1 className={styles.authorName}>{autor.nome}</h1>
                <p className={styles.authorTitle}>{autor.profissao}</p>

                <div className={styles.authorMeta}>
                  <div className={styles.metaItem}>
                    <FaCalendarAlt className={styles.metaIcon} />
                    <span>
                      {autor.nascimento} - {autor.morte}
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <FaMapMarkerAlt className={styles.metaIcon} />
                    <span>{autor.localNascimento}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <FaGraduationCap className={styles.metaIcon} />
                    <span>{autor.movimentoLiterario}</span>
                  </div>
                </div>

                <div className={styles.authorStats}>
                  <div className={styles.statItem}>
                    <FaBook className={styles.statIcon} />
                    <div className={styles.statInfo}>
                      <span className={styles.statNumber}>{livros.length}</span>
                      <span className={styles.statLabel}>Obras</span>
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <FaUsers className={styles.statIcon} />
                    <div className={styles.statInfo}>
                      <span className={styles.statNumber}>
                        {seguidores.toLocaleString()}
                      </span>
                      <span className={styles.statLabel}>Seguidores</span>
                    </div>
                  </div>
                </div>

                <div className={styles.authorActions}>
                  <button
                    className={`${styles.followBtn} ${
                      isFollowing ? styles.following : ""
                    }`}
                    onClick={handleFollow}
                  >
                    <FaHeart /> {isFollowing ? "Seguindo" : "Seguir"}
                  </button>
                  <button className={styles.shareBtn} onClick={shareAuthor}>
                    <FaShare /> Compartilhar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Biografia */}
        <section className={styles.biography}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Biografia</h2>
            <div className={styles.biographyContent}>
              <p className={styles.biographyText}>
                {showFullBio
                  ? autor.biografia
                  : `${autor.biografia.substring(0, 400)}...`}
              </p>
              <button
                className={styles.toggleBtn}
                onClick={() => setShowFullBio(!showFullBio)}
              >
                {showFullBio ? "Ver menos" : "Ver mais"}
              </button>
            </div>
          </div>
        </section>

        {/* Prêmios e Reconhecimentos */}
        <section className={styles.awards}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Prêmios e Reconhecimentos</h2>
            <div className={styles.awardsGrid}>
              {autor.premios.map((premio, index) => (
                <div key={index} className={styles.awardCard}>
                  <FaTrophy className={styles.awardIcon} />
                  <p className={styles.awardText}>{premio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Citações Famosas */}
        <section className={styles.quotes}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Citações Famosas</h2>
            <div className={styles.quotesGrid}>
              {autor.citacoesFamosas.map((citacao, index) => (
                <div key={index} className={styles.quoteCard}>
                  <FaQuoteLeft className={styles.quoteIcon} />
                  <p className={styles.quoteText}>"{citacao}"</p>
                  <p className={styles.quoteAuthor}>— {autor.nome}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Obras Principais */}
        <section className={styles.works}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Principais Obras</h2>
            <div className={styles.worksGrid}>
              {autor.obrasPrincipais.map((obra, index) => (
                <div key={index} className={styles.workCard}>
                  <div
                    className={styles.workCover}
                    style={{
                      backgroundImage: `linear-gradient(45deg, 
                      ${
                        index % 4 === 0
                          ? "#8B4513, #D2691E"
                          : index % 4 === 1
                          ? "#006400, #32CD32"
                          : index % 4 === 2
                          ? "#4B0082, #9370DB"
                          : "#8B0000, #DC143C"
                      })`,
                    }}
                  >
                    <span className={styles.workTitle}>
                      {obra.titulo.toUpperCase()}
                    </span>
                  </div>
                  <div className={styles.workInfo}>
                    <h3 className={styles.workName}>{obra.titulo}</h3>
                    <p className={styles.workYear}>{obra.ano}</p>
                    <p className={styles.workType}>{obra.tipo}</p>
                    <div className={styles.workRating}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} className={styles.star} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Curiosidades */}
        <section className={styles.curiosities}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Curiosidades</h2>
            <div className={styles.curiositiesGrid}>
              {autor.curiosidades.map((curiosidade, index) => (
                <div key={index} className={styles.curiosityCard}>
                  <div className={styles.curiosityNumber}>{index + 1}</div>
                  <p className={styles.curiosityText}>{curiosidade}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Influências */}
        <section className={styles.influences}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Influências Literárias</h2>
            <div className={styles.influencesGrid}>
              {autor.influencias.map((influencia, index) => (
                <div key={index} className={styles.influenceCard}>
                  <p className={styles.influenceText}>{influencia}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className={styles.timeline}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Linha do Tempo</h2>
            <div className={styles.timelineContainer}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>1839</div>
                <div className={styles.timelineContent}>
                  <h3>Nascimento</h3>
                  <p>Nasce no Rio de Janeiro</p>
                </div>
              </div>
              {autor.obrasPrincipais.map((obra, index) => (
                <div key={index} className={styles.timelineItem}>
                  <div className={styles.timelineYear}>{obra.ano}</div>
                  <div className={styles.timelineContent}>
                    <h3>Publicação de "{obra.titulo}"</h3>
                    <p>{obra.tipo}</p>
                  </div>
                </div>
              ))}
              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>1908</div>
                <div className={styles.timelineContent}>
                  <h3>Falecimento</h3>
                  <p>Deixa um legado literário incomparável</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
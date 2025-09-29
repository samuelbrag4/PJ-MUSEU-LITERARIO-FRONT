'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaBook, FaUser, FaCalendar, FaTag, FaStar, FaHeart, FaShare, FaDownload, FaQuoteLeft } from 'react-icons/fa';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import styles from './[book].module.css';

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

  // Dados mock para demonstração
  const mockBookData = {
    id: 1,
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    ano_lancamento: 1899,
    genero: "Romance",
    paginas: 256,
    editora: "Editora H. Garnier",
    isbn: "978-85-359-0277-4",
    idioma: "Português",
    sinopse: "Dom Casmurro é um dos mais famosos romances do escritor brasileiro Machado de Assis. Narrado em primeira pessoa pelo protagonista Bento Santiago, o livro conta a história de sua paixão por Capitu, sua vizinha de infância. O romance é considerado uma obra-prima da literatura brasileira e um dos principais exemplos do Realismo no país. A narrativa aborda temas como ciúme, amor, traição e a condição humana, sendo narrada por um narrador que pode não ser confiável.",
    citacoes: [
      "Capitu deu-me as costas, voltando-se para o espelhinho. Peguei-lhe dos cabelos, colhi-os todos e entrei a alisá-los com o pente, desde a raiz até às pontas.",
      "O resto é saber se a Capitu da praia da Glória já estava dentro da de Mata-cavalos, ou se esta foi mudada naquela por efeito de algum caso incidente.",
      "A vida é uma ópera e uma grande ópera. O tenor e o barítono lutam pelo soprano, em presença do baixo e dos comprimários."
    ],
    personagens: [
      { nome: "Bento Santiago (Dom Casmurro)", descricao: "Narrador e protagonista, homem ciumento que conta sua história" },
      { nome: "Capitu", descricao: "Capitolina, amor de infância de Bento e personagem central" },
      { nome: "Escobar", descricao: "Melhor amigo de Bento e possível amante de Capitu" },
      { nome: "José Dias", descricao: "Agregado da família Santiago, influente nas decisões" }
    ],
    contextoHistorico: "Publicado em 1899, Dom Casmurro foi escrito durante o período do Realismo brasileiro. A obra reflete as mudanças sociais do final do século XIX, incluindo a abolição da escravatura (1888) e a Proclamação da República (1889).",
    analise: "Dom Casmurro é considerado uma das maiores obras da literatura brasileira. Machado de Assis emprega técnicas narrativas sofisticadas, incluindo um narrador não-confiável que deixa a interpretação dos fatos em aberto. A questão central - se Capitu traiu ou não Bento - permanece um mistério proposital.",
    rating: 4.8,
    totalRatings: 15420,
    disponivel: true
  };

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setBook(mockBookData);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handleRating = (rating) => {
    setUserRating(rating);
  };

  const shareBook = () => {
    if (navigator.share) {
      navigator.share({
        title: book?.titulo,
        text: `Confira este livro: ${book?.titulo} por ${book?.autor}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando informações do livro...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className={styles.errorContainer}>
        <h2>Livro não encontrado</h2>
        <button onClick={() => router.back()}>Voltar</button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      
      <main className={styles.main}>
        {/* Hero Section do Livro */}
        <section className={styles.bookHero}>
          <div className={styles.container}>
            <div className={styles.bookInfo}>
              <div className={styles.bookCover}>
                <div className={styles.coverImage} style={{backgroundImage: 'linear-gradient(45deg, #8B4513, #D2691E)'}}>
                  <span className={styles.coverTitle}>{book.titulo.toUpperCase()}</span>
                </div>
                <div className={styles.bookStatus}>
                  {book.disponivel ? 'Disponível' : 'Indisponível'}
                </div>
              </div>
              
              <div className={styles.bookDetails}>
                <h1 className={styles.bookTitle}>{book.titulo}</h1>
                <h2 className={styles.bookAuthor}>por {book.autor}</h2>
                
                <div className={styles.bookMeta}>
                  <div className={styles.metaItem}>
                    <FaCalendar className={styles.metaIcon} />
                    <span>{book.ano_lancamento}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <FaTag className={styles.metaIcon} />
                    <span>{book.genero}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <FaBook className={styles.metaIcon} />
                    <span>{book.paginas} páginas</span>
                  </div>
                </div>

                <div className={styles.rating}>
                  <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar 
                        key={star}
                        className={star <= Math.floor(book.rating) ? styles.starFilled : styles.starEmpty}
                      />
                    ))}
                  </div>
                  <span className={styles.ratingText}>
                    {book.rating} ({book.totalRatings.toLocaleString()} avaliações)
                  </span>
                </div>

                <div className={styles.bookActions}>
                  <button 
                    className={`${styles.favoriteBtn} ${isFavorited ? styles.favorited : ''}`}
                    onClick={toggleFavorite}
                  >
                    <FaHeart /> {isFavorited ? 'Favoritado' : 'Favoritar'}
                  </button>
                  <button className={styles.shareBtn} onClick={shareBook}>
                    <FaShare /> Compartilhar
                  </button>
                  <button className={styles.downloadBtn}>
                    <FaDownload /> Baixar PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sinopse */}
        <section className={styles.synopsis}>
          <div className={styles.container}>
            <h3 className={styles.sectionTitle}>Sinopse</h3>
            <div className={styles.synopsisContent}>
              <p className={styles.synopsisText}>
                {showFullSynopsis ? book.sinopse : `${book.sinopse.substring(0, 300)}...`}
              </p>
              <button 
                className={styles.toggleBtn}
                onClick={() => setShowFullSynopsis(!showFullSynopsis)}
              >
                {showFullSynopsis ? 'Ver menos' : 'Ver mais'}
              </button>
            </div>
          </div>
        </section>

        {/* Personagens */}
        <section className={styles.characters}>
          <div className={styles.container}>
            <h3 className={styles.sectionTitle}>Personagens Principais</h3>
            <div className={styles.charactersGrid}>
              {book.personagens.map((personagem, index) => (
                <div key={index} className={styles.characterCard}>
                  <div className={styles.characterAvatar}>
                    <FaUser />
                  </div>
                  <h4 className={styles.characterName}>{personagem.nome}</h4>
                  <p className={styles.characterDesc}>{personagem.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Citações */}
        <section className={styles.quotes}>
          <div className={styles.container}>
            <h3 className={styles.sectionTitle}>Citações Memoráveis</h3>
            <div className={styles.quotesGrid}>
              {book.citacoes.map((citacao, index) => (
                <div key={index} className={styles.quoteCard}>
                  <FaQuoteLeft className={styles.quoteIcon} />
                  <p className={styles.quoteText}>{citacao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Análise e Contexto */}
        <section className={styles.analysis}>
          <div className={styles.container}>
            <div className={styles.analysisGrid}>
              <div className={styles.analysisCard}>
                <h3 className={styles.cardTitle}>Contexto Histórico</h3>
                <p className={styles.cardText}>{book.contextoHistorico}</p>
              </div>
              <div className={styles.analysisCard}>
                <h3 className={styles.cardTitle}>Análise Crítica</h3>
                <p className={styles.cardText}>{book.analise}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Avaliação do Usuário */}
        <section className={styles.userRating}>
          <div className={styles.container}>
            <h3 className={styles.sectionTitle}>Avalie este livro</h3>
            <div className={styles.ratingSection}>
              <div className={styles.userStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar 
                    key={star}
                    className={star <= userRating ? styles.userStarFilled : styles.userStarEmpty}
                    onClick={() => handleRating(star)}
                  />
                ))}
              </div>
              <p className={styles.ratingHelp}>Clique nas estrelas para avaliar</p>
            </div>
          </div>
        </section>

        {/* Informações Técnicas */}
        <section className={styles.technicalInfo}>
          <div className={styles.container}>
            <h3 className={styles.sectionTitle}>Informações Técnicas</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Editora:</span>
                <span className={styles.infoValue}>{book.editora}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>ISBN:</span>
                <span className={styles.infoValue}>{book.isbn}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Idioma:</span>
                <span className={styles.infoValue}>{book.idioma}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Páginas:</span>
                <span className={styles.infoValue}>{book.paginas}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

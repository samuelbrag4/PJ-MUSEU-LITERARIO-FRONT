'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaExclamationTriangle, 
  FaCalendarAlt, 
  FaTheaterMasks, 
  FaDollarSign, 
  FaBookOpen, 
  FaChartBar, 
  FaFilm, 
  FaBook,
  FaPen 
} from 'react-icons/fa';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import CardBook from '../../../components/CardBook';  
import styles from './livro.module.css';

export default function LivroPage() {
  const [livro, setLivro] = useState(null);
  const [autor, setAutor] = useState(null);
  const [outrosLivrosDoAutor, setOutrosLivrosDoAutor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const params = useParams();
  const livroId = params.id;

  useEffect(() => {
    if (livroId) {
      carregarLivro();
    }
  }, [livroId]);

  const carregarLivro = async () => {
    try {
      setLoading(true);
      
      // Tentar buscar o livro específico
      try {
        const response = await fetch(`http://localhost:5000/livros/${livroId}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.livro) {
            setLivro(data.livro);
            await carregarAutorDoLivro(data.livro.autorId);
            return;
          }
        }
      } catch (error) {
        console.log('Endpoint específico não disponível, usando fallback...');
      }
      
      // Fallback: buscar todos os livros e filtrar pelo ID
      const todosLivrosResponse = await fetch('http://localhost:5000/livros');
      
      if (!todosLivrosResponse.ok) {
        setError('Erro ao carregar dados dos livros.');
        return;
      }

      const todosLivros = await todosLivrosResponse.json();
      const livros = todosLivros.livros || [];
      
      const livroEncontrado = livros.find(l => l.id === parseInt(livroId));
      
      if (livroEncontrado) {
        setLivro(livroEncontrado);
        await carregarAutorDoLivro(livroEncontrado.autorId);
      } else {
        setError('Livro não encontrado.');
      }
      
    } catch (error) {
      console.error('Erro ao carregar livro:', error);
      setError('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const carregarAutorDoLivro = async (autorId) => {
    try {
      // Buscar dados do autor
      const response = await fetch('http://localhost:5000/escritores');
      
      if (response.ok) {
        const data = await response.json();
        const escritores = Array.isArray(data) ? data : (data.value || []);
        
        const autorEncontrado = escritores.find(escritor => escritor.id === autorId);
        
        if (autorEncontrado) {
          setAutor(autorEncontrado);
          
          // Filtrar outros livros do mesmo autor (excluindo o atual)
          const outrosLivros = (autorEncontrado.livros || []).filter(l => l.id !== parseInt(livroId));
          setOutrosLivrosDoAutor(outrosLivros);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar autor:', error);
    }
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

  const getDificuldadeColor = (dificuldade) => {
    switch (dificuldade?.toUpperCase()) {
      case 'FACIL': return '#4CAF50';
      case 'MEDIA': return '#FF9800';
      case 'DIFICIL': return '#F44336';
      default: return '#4f8209';
    }
  };

  const getDificuldadeText = (dificuldade) => {
    switch (dificuldade?.toUpperCase()) {
      case 'FACIL': return 'Fácil';
      case 'MEDIA': return 'Médio';
      case 'DIFICIL': return 'Difícil';
      default: return 'Não informado';
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.loading}>Carregando livro...</div>
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

  if (!livro) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.error}>
              <h2><FaExclamationTriangle /> Livro não encontrado</h2>
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
            ← Voltar aos Livros
          </button>

          {/* Informações do Livro */}
          <section className={styles.bookSection}>
            <div className={styles.bookHeader}>
              <div className={styles.bookImageLarge}>
                <img 
                  src={livro.imagem || '/livros/default.jpg'} 
                  alt={livro.titulo}
                  onError={(e) => {
                    e.target.src = '/livros/default.jpg';
                  }}
                />
              </div>
              
              <div className={styles.bookInfo}>
                <h1 className={styles.bookTitle}>{livro.titulo}</h1>
                
                <div className={styles.bookDetails}>
                  {autor && (
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}><FaPen /> Autor:</span>
                      <Link 
                        href={`/autor/${autor.id}`} 
                        className={styles.authorLink}
                      >
                        {autor.nome}
                      </Link>
                    </div>
                  )}
                  
                  <div className={styles.detail}>
                    <span className={styles.detailLabel}><FaCalendarAlt /> Ano:</span>
                    <span className={styles.detailValue}>{livro.anoLancamento}</span>
                  </div>
                  
                  <div className={styles.detail}>
                    <span className={styles.detailLabel}><FaTheaterMasks /> Gênero:</span>
                    <span className={styles.genreTag}>{livro.genero}</span>
                  </div>
                  
                  <div className={styles.detail}>
                    <span className={styles.detailLabel}><FaDollarSign /> Preço:</span>
                    <span className={styles.priceValue}>R$ {livro.mediaPreco}</span>
                  </div>
                  
                  <div className={styles.detail}>
                    <span className={styles.detailLabel}><FaBookOpen /> Páginas:</span>
                    <span className={styles.detailValue}>{livro.numeroPaginas}</span>
                  </div>
                  
                  <div className={styles.detail}>
                    <span className={styles.detailLabel}><FaChartBar /> Dificuldade:</span>
                    <span 
                      className={styles.difficultyTag}
                      style={{ backgroundColor: getDificuldadeColor(livro.dificuldade) }}
                    >
                      {getDificuldadeText(livro.dificuldade)}
                    </span>
                  </div>
                  
                  <div className={styles.detail}>
                    <span className={styles.detailLabel}><FaFilm /> Adaptação:</span>
                    <span className={styles.detailValue}>
                      {livro.temAdaptacao ? 'Sim' : 'Não'}
                      {livro.temAdaptacao && <FaTheaterMasks />}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {livro.descricao && (
              <div className={styles.description}>
                <h2 className={styles.descriptionTitle}><FaBook /> Descrição</h2>
                <p className={styles.descriptionText}>{livro.descricao}</p>
              </div>
            )}
          </section>

          {/* Informações do Autor */}
          {autor && (
            <section className={styles.authorSection}>
              <h2 className={styles.sectionTitle}>
                ✍️ Sobre o Autor
              </h2>
              
              <Link href={`/autor/${autor.id}`} className={styles.authorCard}>
                <div className={styles.authorImage}>
                  <img 
                    src={autor.foto || '/autores/default.jpg'} 
                    alt={autor.nome}
                    onError={(e) => {
                      e.target.src = '/autores/default.jpg';
                    }}
                  />
                </div>
                <div className={styles.authorInfo}>
                  <h3 className={styles.authorName}>{autor.nome}</h3>
                  {autor.biografia && (
                    <p className={styles.authorBio}>
                      {autor.biografia.length > 200 
                        ? `${autor.biografia.substring(0, 200)}...` 
                        : autor.biografia}
                    </p>
                  )}
                  <div className={styles.authorStats}>
                    <span><FaBook /> {autor.livros?.length || 0} obras</span>
                    {autor.email && <span>📧 {autor.email}</span>}
                  </div>
                  <span className={styles.clickHint}>Clique para ver mais →</span>
                </div>
              </Link>
            </section>
          )}

          {/* Outros Livros do Autor */}
          {outrosLivrosDoAutor.length > 0 && (
            <section className={styles.otherBooksSection}>
              <h2 className={styles.sectionTitle}>
                <FaBookOpen /> Outros livros de {autor?.nome}
              </h2>
              
              <div className={styles.booksGrid}>
                {outrosLivrosDoAutor.map(outroLivro => (
                  <CardBook key={outroLivro.id} livro={outroLivro} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
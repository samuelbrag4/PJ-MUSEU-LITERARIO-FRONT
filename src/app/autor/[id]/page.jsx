'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import CardBook from '../../../components/CardBook';
import styles from './autor.module.css';

export default function AutorPage() {
  const [autor, setAutor] = useState(null);
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const params = useParams();
  const autorId = params.id;

  useEffect(() => {
    if (autorId) {
      carregarAutor();
    }
  }, [autorId]);

  const carregarAutor = async () => {
    try {
      setLoading(true);
      
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

  const calcularIdade = (dataNascimento, dataFalecimento) => {
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
              <h2>❌ {error}</h2>
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
              <h2>❌ Autor não encontrado</h2>
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
            ← Voltar aos Livros
          </button>

          {/* Informações do Autor */}
          <section className={styles.authorSection}>
            <div className={styles.authorHeader}>
              <div className={styles.authorImageLarge}>
                <img 
                  src={autor.foto || '/autores/default.jpg'} 
                  alt={autor.nome}
                  onError={(e) => {
                    e.target.src = '/autores/default.jpg';
                  }}
                />
              </div>
              
              <div className={styles.authorInfo}>
                <h1 className={styles.authorName}>{autor.nome}</h1>
                
                <div className={styles.authorDetails}>
                  {autor.dataNascimento && (
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>📅 Nascimento:</span>
                      <span className={styles.detailValue}>
                        {formatarData(autor.dataNascimento)}
                        {idade && ` (${idade} anos${isVivo ? '' : ' quando faleceu'})`}
                      </span>
                    </div>
                  )}
                  
                  {autor.dataFalecimento && (
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>⚰️ Falecimento:</span>
                      <span className={styles.detailValue}>
                        {formatarData(autor.dataFalecimento)}
                      </span>
                    </div>
                  )}
                  
                  {autor.email && (
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>📧 Email:</span>
                      <span className={styles.detailValue}>{autor.email}</span>
                    </div>
                  )}
                  
                  <div className={styles.detail}>
                    <span className={styles.detailLabel}>📚 Obras:</span>
                    <span className={styles.detailValue}>
                      {livros.length} {livros.length === 1 ? 'obra' : 'obras'} cadastradas
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {autor.biografia && (
              <div className={styles.biography}>
                <h2 className={styles.biographyTitle}>📖 Biografia</h2>
                <p className={styles.biographyText}>{autor.biografia}</p>
              </div>
            )}
          </section>

          {/* Obras do Autor */}
          <section className={styles.worksSection}>
            <h2 className={styles.sectionTitle}>
              📚 Obras de {autor.nome}
            </h2>
            
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
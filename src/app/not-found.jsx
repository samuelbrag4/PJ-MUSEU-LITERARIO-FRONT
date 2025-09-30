'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaBook, FaLightbulb, FaSmile, FaRedo } from 'react-icons/fa';
import styles from './not-found.module.css';

export default function NotFound() {
  const router = useRouter();
  const [currentJoke, setCurrentJoke] = useState(0);
  const [currentCuriosity, setCurrentCuriosity] = useState(0);

  const piadas = [
    "Por que o livro foi ao médico? Porque estava com as páginas soltas!",
    "O que o dicionário disse para a gramática? - Você me define!",
    "Por que a vírgula foi ao psicólogo? Porque vivia tendo pausas!",
    "O que um livro de terror fala para outro? - Nossa história é de arrepiar!",
    "Por que o poeta sempre carrega um lápis? Para fazer versos de improviso!",
    "O que a biblioteca disse para o livro barulhento? - Silêncio, por favor!",
    "Por que o romance foi expulso da escola? Porque vivia contando histórias!",
    "O que um ponto final disse para a exclamação? - Você é muito dramática!",
    "Por que o livro de matemática estava triste? Porque tinha muitos problemas!",
    "O que a enciclopédia disse para o dicionário? - Você tem uma palavra para tudo!"
  ];

  const curiosidades = [
    "Machado de Assis escreveu mais de 600 crônicas para jornais da época.",
    "O maior livro do mundo tem mais de 14 metros quando aberto!",
    "A palavra 'biblioteca' vem do grego 'biblion' (livro) e 'theke' (depósito).",
    "Shakespeare inventou mais de 1.700 palavras que usamos até hoje.",
    "O primeiro livro impresso no Brasil foi em 1808, trazido pela Imprensa Régia.",
    "Clarice Lispector escreveu 'A Hora da Estrela' em apenas 2 meses.",
    "O livro mais vendido do mundo (além da Bíblia) é Dom Quixote, de Cervantes.",
    "José de Alencar escreveu 'O Guarani' inspirado em uma ópera de Carlos Gomes.",
    "A primeira biblioteca pública do Brasil foi fundada em Salvador, em 1811.",
    "Monteiro Lobato criou o Sítio do Picapau Amarelo para educar crianças sobre o folclore brasileiro."
  ];

  const handleGoBack = () => {
    router.back();
  };

  const nextJoke = () => {
    setCurrentJoke((prev) => (prev + 1) % piadas.length);
  };

  const nextCuriosity = () => {
    setCurrentCuriosity((prev) => (prev + 1) % curiosidades.length);
  };

  useEffect(() => {
    // Randomizar piada e curiosidade inicial
    setCurrentJoke(Math.floor(Math.random() * piadas.length));
    setCurrentCuriosity(Math.floor(Math.random() * curiosidades.length));
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.errorCode}>404</div>
          <h1 className={styles.title}>Página Extraviada!</h1>
          <p className={styles.description}>
            Ops! Parece que esta página se perdeu entre as estantes do nosso Museu Literário.
            Mas não se preocupe, enquanto você está aqui, que tal se divertir um pouco?
          </p>
          
          <div className={styles.bookIcon}><FaBook /></div>
          
          {/* Seção de Piadas */}
          <div className={styles.entertainmentSection}>
            <div className={styles.jokeSection}>
              <h2 className={styles.sectionTitle}>
                <FaSmile className={styles.sectionIcon} />
                Piada Literária
              </h2>
              <div className={styles.jokeCard}>
                <p className={styles.jokeText}>"{piadas[currentJoke]}"</p>
                <button onClick={nextJoke} className={styles.refreshButton}>
                  <FaRedo /> Nova Piada
                </button>
              </div>
            </div>

            {/* Seção de Curiosidades */}
            <div className={styles.curiositySection}>
              <h2 className={styles.sectionTitle}>
                <FaLightbulb className={styles.sectionIcon} />
                Curiosidade Literária
              </h2>
              <div className={styles.curiosityCard}>
                <p className={styles.curiosityText}>{curiosidades[currentCuriosity]}</p>
                <button onClick={nextCuriosity} className={styles.refreshButton}>
                  <FaRedo /> Nova Curiosidade
                </button>
              </div>
            </div>
          </div>
          
          <div className={styles.actions}>
            <Link href="/home" className={styles.primaryButton}>
              Explorar o Museu
            </Link>
            <button onClick={handleGoBack} className={styles.secondaryButton}>
              Voltar ao Catálogo
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaHome, 
  FaArrowLeft, 
  FaArrowRight, 
  FaPlay, 
  FaPause,
  FaBook,
  FaUsers,
  FaCode,
  FaGraduationCap,
  FaHeart,
  FaTimes,
  FaProjectDiagram,
  FaGlobe,
  FaChartLine,
  FaCog,
  FaRocket,
  FaStar,
  FaLightbulb,
  FaTarget,
  FaTools,
  FaCheckCircle
} from 'react-icons/fa';
import styles from './apresentacao.module.css';

export default function ApresentacaoPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const router = useRouter();

  const totalSlides = 11;

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlide(prev => prev < totalSlides - 1 ? prev + 1 : 0);
      }, 8000); // 8 seconds per slide
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') previousSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'Escape') setShowModal(false);
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  const nextSlide = () => {
    setCurrentSlide(prev => prev < totalSlides - 1 ? prev + 1 : prev);
    setIsPlaying(false);
  };

  const previousSlide = () => {
    setCurrentSlide(prev => prev > 0 ? prev - 1 : prev);
    setIsPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsPlaying(false);
  };

  const openModal = (content) => {
    setModalContent(content);
    setShowModal(true);
    setIsPlaying(false);
  };

  return (
    <div className={styles.presentation}>
      {/* Header de Apresentação */}
      <div className={styles.presentationHeader}>
        <div className={styles.headerContainer}>
          {/* Logo e Título */}
          <div className={styles.headerLeft}>
            <div className={styles.logoSection}>
              <FaBook className={styles.logoIcon} />
              <span className={styles.logoText}>Museu Literário</span>
            </div>
          </div>

          {/* Controles Centrais */}
          <div className={styles.headerCenter}>
            <button 
              onClick={previousSlide}
              disabled={currentSlide === 0}
              className={styles.navButton}
              aria-label="Slide anterior"
            >
              <FaArrowLeft />
              Anterior
            </button>

            <div className={styles.slideInfo}>
              <span className={styles.slideCounter}>
                {currentSlide + 1} / {totalSlides}
              </span>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progress}
                  style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
                />
              </div>
            </div>

            <button 
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              className={styles.navButton}
              aria-label="Próximo slide"
            >
              Próximo
              <FaArrowRight />
            </button>
          </div>

          {/* Controles Direita */}
          <div className={styles.headerRight}>
            <Link href="/home" className={styles.backButton}>
              <FaHome />
              Sair
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Navigation Lateral */}
      <div className={styles.slideNav}>
        {Array.from({length: totalSlides}, (_, index) => (
          <button
            key={index}
            className={`${styles.navDot} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Main Slide Content */}
      <div className={styles.slide}>
        <div className={styles.slideContent}>
          
          {/* SLIDE 1 - CAPA */}
          {currentSlide === 0 && (
            <div className={styles.coverSlide}>
              <div className={styles.logoSection}>
                <h1 className={styles.mainTitle}>MUSEU LITERÁRIO</h1>
                <p className={styles.subtitle}>Plataforma Digital de Literatura</p>
              </div>
              
              <div className={styles.authorInfo}>
                <h2 className={styles.authorName}>Samuel dos Santos Braga</h2>
                <p className={styles.courseInfo}>Técnico em Desenvolvimento de Sistemas</p>
                <p className={styles.courseInfo}>Projeto 3</p>
                <div className={styles.senaiLogo}>SENAI</div>
              </div>
            </div>
          )}

          {/* SLIDE 2 - PROBLEMA/MOTIVAÇÃO */}
          {currentSlide === 1 && (
            <div className={styles.contentSlide}>
              <div className={styles.slideHeader}>
                <h1>Problema / Motivação</h1>
                <p className={styles.slideSubtitle}>Qual necessidade estamos resolvendo?</p>
              </div>

              <div className={styles.bulletList}>
                <div className={styles.bulletItem}>
                  Dificuldade em descobrir novos livros e autores
                </div>
                <div className={styles.bulletItem}>
                  Falta de conexão entre leitores e escritores
                </div>
                <div className={styles.bulletItem}>
                  Ausência de plataformas sociais focadas em literatura
                </div>
                <div className={styles.bulletItem}>
                  Necessidade de democratizar o acesso à literatura
                </div>
              </div>

              <button 
                className={styles.moreInfoBtn}
                onClick={() => openModal({
                  problem: 'Muitos leitores têm dificuldade para descobrir novos livros que se alinhem com seus gostos pessoais.',
                  market: 'O mercado de literatura digital cresce 15% ao ano, mas ainda falta conexão social.',
                  impact: 'Escritores independentes lutam para alcançar seu público-alvo de forma eficiente.'
                })}
              >
                Ver Mais Detalhes
              </button>
            </div>
          )}

          {/* SLIDE 3 - SOLUÇÃO PROPOSTA */}
          {currentSlide === 2 && (
            <div className={styles.contentSlide}>
              <div className={styles.slideHeader}>
                <h1>Solução Proposta</h1>
                <p className={styles.slideSubtitle}>Nossa plataforma inovadora</p>
              </div>

              <div className={styles.bulletList}>
                <div className={styles.bulletItem}>
                  Plataforma digital integrada de literatura
                </div>
                <div className={styles.bulletItem}>
                  Conexão direta entre leitores e escritores
                </div>
                <div className={styles.bulletItem}>
                  Sistema de recomendações personalizadas
                </div>
                <div className={styles.bulletItem}>
                  Rede social literária completa
                </div>
              </div>

              <button 
                className={styles.moreInfoBtn}
                onClick={() => openModal({
                  main: 'Uma plataforma que conecta apaixonados por literatura através de tecnologia moderna.',
                  features: 'Catálogo completo, perfis personalizados, sistema de seguidores e descoberta social.',
                  innovation: 'Primeira rede social brasileira 100% focada em literatura e conexões literárias.'
                })}
              >
                Ver Mais Detalhes
              </button>
            </div>
          )}

          {/* SLIDE 4 - PÚBLICO-ALVO */}
          {currentSlide === 3 && (
            <div className={styles.contentSlide}>
              <div className={styles.slideHeader}>
                <h1>Público-Alvo</h1>
                <p className={styles.slideSubtitle}>Para quem desenvolvemos</p>
              </div>

              <div className={styles.gridCards}>
                <div className={styles.gridCard}>
                  <h3>Leitores Ávidos</h3>
                  <p>Pessoas que buscam novos livros e querem compartilhar experiências de leitura</p>
                </div>
                <div className={styles.gridCard}>
                  <h3>Escritores Independentes</h3>
                  <p>Autores que desejam divulgar seus trabalhos e conectar-se com leitores</p>
                </div>
                <div className={styles.gridCard}>
                  <h3>Estudantes e Acadêmicos</h3>
                  <p>Jovens em busca de literatura para estudos e desenvolvimento pessoal</p>
                </div>
                <div className={styles.gridCard}>
                  <h3>Clubs de Leitura</h3>
                  <p>Grupos que querem organizar e compartilhar discussões literárias</p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5 - ESTRUTURA DAS 5 PÁGINAS */}
          {currentSlide === 4 && (
            <div className={styles.contentSlide}>
              <div className={styles.slideHeader}>
                <h1>Estrutura das 5 Páginas</h1>
                <p className={styles.slideSubtitle}>Navegação clara e intuitiva</p>
              </div>

              <div className={styles.bulletList}>
                <div className={styles.bulletItem}>
                  Home - Dashboard principal com visão geral
                </div>
                <div className={styles.bulletItem}>
                  Livros - Catálogo completo com filtros avançados
                </div>
                <div className={styles.bulletItem}>
                  Autores - Perfis detalhados dos escritores
                </div>
                <div className={styles.bulletItem}>
                  Perfil - Área pessoal do usuário
                </div>
                <div className={styles.bulletItem}>
                  Curiosidades - Conteúdo extra e favoritos
                </div>
              </div>

              <button 
                className={styles.moreInfoBtn}
                onClick={() => openModal({
                  home: 'Dashboard com estatísticas, recomendações e atividades recentes dos usuários.',
                  catalog: 'Sistema de busca avançada com filtros por gênero, autor, ano e avaliações.',
                  social: 'Funcionalidades sociais integradas em todas as páginas para engajamento.'
                })}
              >
                Ver Mais Detalhes
              </button>
            </div>
          )}

          {/* SLIDE 6 - FLUXO DE NAVEGAÇÃO */}
          {currentSlide === 5 && (
            <div className={styles.contentSlide}>
              <div className={styles.slideHeader}>
                <h1>Fluxo de Navegação</h1>
                <p className={styles.slideSubtitle}>Jornada do usuário na plataforma</p>
              </div>

              <div className={styles.userFlows}>
                <div className={styles.flowColumn}>
                  <h3 className={styles.flowTitle}>Usuário Novo</h3>
                  <div className={styles.flowDiagram}>
                    <div className={styles.flowItem}>
                      <div className={styles.flowNumber}>1</div>
                      <div className={styles.flowText}>Acessa a Home</div>
                    </div>
                    <div className={styles.flowItem}>
                      <div className={styles.flowNumber}>2</div>
                      <div className={styles.flowText}>Explora catálogo de livros</div>
                    </div>
                    <div className={styles.flowItem}>
                      <div className={styles.flowNumber}>3</div>
                      <div className={styles.flowText}>Visualiza perfis de autores</div>
                    </div>
                    <div className={styles.flowItem}>
                      <div className={styles.flowNumber}>4</div>
                      <div className={styles.flowText}>Cria conta e personaliza perfil</div>
                    </div>
                    <div className={styles.flowItem}>
                      <div className={styles.flowNumber}>5</div>
                      <div className={styles.flowText}>Começa a seguir autores favoritos</div>
                    </div>
                  </div>
                </div>

                <div className={styles.flowColumn}>
                  <h3 className={styles.flowTitle}>Usuário Registrado</h3>
                  <div className={styles.flowDiagram}>
                    <div className={styles.flowItem}>
                      <div className={styles.flowNumber}>1</div>
                      <div className={styles.flowText}>Login no dashboard</div>
                    </div>
                    <div className={styles.flowItem}>
                      <div className={styles.flowNumber}>2</div>
                      <div className={styles.flowText}>Verifica recomendações personalizadas</div>
                    </div>
                    <div className={styles.flowItem}>
                      <div className={styles.flowNumber}>3</div>
                      <div className={styles.flowText}>Interage com conteúdo</div>
                    </div>
                    <div className={styles.flowItem}>
                      <div className={styles.flowNumber}>4</div>
                      <div className={styles.flowText}>Descobre novos autores</div>
                    </div>
                    <div className={styles.flowItem}>
                      <div className={styles.flowNumber}>5</div>
                      <div className={styles.flowText}>Gerencia biblioteca pessoal</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 7 - TECNOLOGIAS E ARQUITETURA */}
          {currentSlide === 6 && (
            <div className={styles.contentSlide}>
              <div className={styles.slideHeader}>
                <h1>Tecnologias e Arquitetura</h1>
                <p className={styles.slideSubtitle}>Stack moderno e robusto</p>
              </div>

              <div className={styles.techStack}>
                <div className={styles.techColumn}>
                  <h3>Frontend</h3>
                  <div className={styles.techItem}>Next.js 15</div>
                  <div className={styles.techItem}>React 18</div>
                  <div className={styles.techItem}>CSS Modules</div>
                  <div className={styles.techItem}>JavaScript ES6+</div>
                </div>
                <div className={styles.techColumn}>
                  <h3>Backend</h3>
                  <div className={styles.techItem}>Node.js</div>
                  <div className={styles.techItem}>Express.js</div>
                  <div className={styles.techItem}>JWT Auth</div>
                  <div className={styles.techItem}>API REST</div>
                </div>
                <div className={styles.techColumn}>
                  <h3>Ferramentas</h3>
                  <div className={styles.techItem}>Git/GitHub</div>
                  <div className={styles.techItem}>VS Code</div>
                  <div className={styles.techItem}>Postman</div>
                  <div className={styles.techItem}>DevTools</div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 8 - FUNCIONALIDADES PRINCIPAIS */}
          {currentSlide === 7 && (
            <div className={styles.contentSlide}>
              <div className={styles.slideHeader}>
                <h1>Funcionalidades Principais</h1>
                <p className={styles.slideSubtitle}>O que a plataforma oferece</p>
              </div>

              <div className={styles.featuresGrid}>
                <div className={styles.featureCard}>
                  <h3>Autenticação Segura</h3>
                  <p>Sistema de login/cadastro com JWT</p>
                </div>
                <div className={styles.featureCard}>
                  <h3>Catálogo Dinâmico</h3>
                  <p>Exploração de livros e autores</p>
                </div>
                <div className={styles.featureCard}>
                  <h3>Perfis Personalizados</h3>
                  <p>Customização completa do usuário</p>
                </div>
                <div className={styles.featureCard}>
                  <h3>Sistema Social</h3>
                  <p>Seguir autores e interagir</p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 9 - QUALIDADE E TESTES */}
          {currentSlide === 8 && (
            <div className={styles.contentSlide}>
              <div className={styles.slideHeader}>
                <h1>Qualidade e Testes</h1>
                <p className={styles.slideSubtitle}>Garantindo excelência técnica</p>
              </div>

              <div className={styles.bulletList}>
                <div className={styles.bulletItem}>
                  Testes unitários de componentes React
                </div>
                <div className={styles.bulletItem}>
                  Testes de integração da API REST
                </div>
                <div className={styles.bulletItem}>
                  Design responsivo para todos os dispositivos
                </div>
                <div className={styles.bulletItem}>
                  Tratamento de erros e loading states
                </div>
                <div className={styles.bulletItem}>
                  Otimização de performance e SEO
                </div>
              </div>

              <button 
                className={styles.moreInfoBtn}
                onClick={() => openModal({
                  testing: 'Implementamos testes automatizados para garantir qualidade e confiabilidade.',
                  ux: 'Interface intuitiva seguindo princípios de UX/UI design moderno.',
                  performance: 'Otimizações de código e imagens para carregamento rápido.'
                })}
              >
                Ver Mais Detalhes
              </button>
            </div>
          )}

          {/* SLIDE 10 - PRÓXIMOS PASSOS */}
          {currentSlide === 9 && (
            <div className={styles.contentSlide}>
              <div className={styles.slideHeader}>
                <h1>Próximos Passos</h1>
                <p className={styles.slideSubtitle}>Visão de futuro do projeto</p>
              </div>

              <div className={styles.futurePlan}>
                <div className={styles.roadmapSection}>
                  <h3>Roadmap</h3>
                  <div className={styles.roadmapGrid}>
                    <div className={styles.roadmapItem}>
                      <div className={styles.roadmapNumber}>1</div>
                      <div className={styles.roadmapText}>Sistema de resenhas e avaliações</div>
                    </div>
                    <div className={styles.roadmapItem}>
                      <div className={styles.roadmapNumber}>2</div>
                      <div className={styles.roadmapText}>Chat direto entre usuários</div>
                    </div>
                    <div className={styles.roadmapItem}>
                      <div className={styles.roadmapNumber}>3</div>
                      <div className={styles.roadmapText}>Recomendações com IA</div>
                    </div>
                    <div className={styles.roadmapItem}>
                      <div className={styles.roadmapNumber}>4</div>
                      <div className={styles.roadmapText}>Modo escuro e temas personalizáveis</div>
                    </div>
                    <div className={styles.roadmapItem}>
                      <div className={styles.roadmapNumber}>5</div>
                      <div className={styles.roadmapText}>App mobile nativo</div>
                    </div>
                    <div className={styles.roadmapItem}>
                      <div className={styles.roadmapNumber}>6</div>
                      <div className={styles.roadmapText}>Integração com e-commerce</div>
                    </div>
                  </div>
                </div>

                <div className={styles.impactSection}>
                  <h3>Impacto Esperado</h3>
                  <div className={styles.impactCard}>
                    <p>Democratizar o acesso à literatura e fortalecer a comunidade literária brasileira</p>
                    <div className={styles.impactStats}>
                      <div className={styles.statItem}>
                        <div className={styles.statNumber}>10k+</div>
                        <div className={styles.statLabel}>Usuários no primeiro ano</div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statNumber}>50k+</div>
                        <div className={styles.statLabel}>Livros no catálogo</div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statNumber}>1k+</div>
                        <div className={styles.statLabel}>Autores cadastrados</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 11 - AGRADECIMENTOS */}
          {currentSlide === 10 && (
            <div className={styles.thanksContent}>
              <h1 className={styles.thanksTitle}>Obrigado!</h1>
              <p className={styles.thanksSubtitle}>Perguntas e Feedback</p>
              
              <div className={styles.thanksMessage}>
                <p>Muito obrigado pela atenção! Este projeto representa minha paixão por tecnologia e literatura.</p>
              </div>

              <div className={styles.contactGrid}>
                <div className={styles.contactCard}>
                  <div className={styles.contactLabel}>GitHub</div>
                  <div className={styles.contactValue}>@samuelbrag4</div>
                </div>
                <div className={styles.contactCard}>
                  <div className={styles.contactLabel}>Email</div>
                  <div className={styles.contactValue}>samuel.braga@email.com</div>
                </div>
                <div className={styles.contactCard}>
                  <div className={styles.contactLabel}>LinkedIn</div>
                  <div className={styles.contactValue}>/in/samuelbraga</div>
                </div>
              </div>

              <div className={styles.accessInfo}>
                <p>Acesse o projeto</p>
                <div className={styles.urlLink}>museu-literario.vercel.app</div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Modal for detailed information */}
      {showModal && modalContent && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeModal}
              onClick={() => setShowModal(false)}
            >
              <FaTimes />
            </button>
            
            <div className={styles.modalHeader}>
              <FaBook className={styles.modalIcon} />
              <h2>Detalhes Adicionais</h2>
            </div>
            
            <div className={styles.modalBody}>
              {Object.entries(modalContent).map(([key, value]) => (
                <div key={key} className={styles.modalSection}>
                  <h4>{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                  <p>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
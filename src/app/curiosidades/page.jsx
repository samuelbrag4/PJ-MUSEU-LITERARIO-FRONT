'use client';
import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { 
  FaBook, 
  FaCalendarAlt, 
  FaUser, 
  FaQuoteLeft,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaFeather,
  FaPalette,
  FaTheaterMasks,
  FaIndustry
} from 'react-icons/fa';
import styles from './curiosidades.module.css';

export default function CuriosidadesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);

  // Dados sobre os períodos literários brasileiros
  const periodosLiterarios = [
    {
      id: 'quinhentismo',
      nome: 'Quinhentismo',
      periodo: '1500-1601',
      icone: <FaFeather />,
      cor: '#8B4513',
      resumo: 'Literatura de informação e catequese no Brasil colonial',
      caracteristicas: [
        'Literatura de informação sobre o "Novo Mundo"',
        'Textos de catequese jesuítica',
        'Crônicas de viagem e cartas',
        'Objetivo informativo e pedagógico',
        'Influência medieval e renascentista'
      ],
      autores: [
        {
          nome: 'Pero Vaz de Caminha',
          obras: ['Carta do Descobrimento do Brasil (1500)'],
          importancia: 'Primeiro documento literário do Brasil'
        },
        {
          nome: 'Padre José de Anchieta',
          obras: ['Poema à Virgem (1563)', 'Teatro de Anchieta'],
          importancia: 'Fundador da literatura brasileira, dramaturgo e poeta'
        },
        {
          nome: 'Padre Manuel da Nóbrega',
          obras: ['Cartas do Brasil (1549-1560)'],
          importancia: 'Importante cronista do período colonial'
        }
      ],
      contextoHistorico: 'Período de colonização do Brasil pelos portugueses, com grande influência da Igreja Católica na educação e cultura.',
      curiosidades: [
        'A Carta de Caminha é considerada a certidão de nascimento do Brasil',
        'Anchieta escreveu o primeiro dicionário tupi-português',
        'A literatura deste período era principalmente utilitária, não artística'
      ]
    },
    {
      id: 'barroco',
      nome: 'Barroco',
      periodo: '1601-1768',
      icone: <FaTheaterMasks />,
      cor: '#DAA520',
      resumo: 'Arte do contraste, religiosidade e conflitos espirituais',
      caracteristicas: [
        'Jogo de contrastes (antíteses)',
        'Linguagem rebuscada e complexa',
        'Temática religiosa vs. mundana',
        'Uso de figuras de linguagem',
        'Conflito entre fé e razão'
      ],
      autores: [
        {
          nome: 'Gregório de Matos',
          obras: ['Poesias Satíricas', 'Poesias Líricas', 'Poesias Religiosas'],
          importancia: 'O "Boca do Inferno", primeiro grande poeta brasileiro'
        },
        {
          nome: 'Padre Antônio Vieira',
          obras: ['Sermões', 'Cartas', 'História do Futuro'],
          importancia: 'Maior orador sacro em língua portuguesa'
        },
        {
          nome: 'Bento Teixeira',
          obras: ['Prosopopeia (1601)'],
          importancia: 'Autor do primeiro poema épico do Brasil'
        }
      ],
      contextoHistorico: 'Período de consolidação colonial, descoberta do ouro, conflitos religiosos da Contrarreforma.',
      curiosidades: [
        'Gregório de Matos nunca publicou suas obras em vida',
        'Vieira foi processado pela Inquisição',
        'O Barroco brasileiro tinha forte crítica social'
      ]
    },
    {
      id: 'arcadismo',
      nome: 'Arcadismo',
      periodo: '1768-1836',
      icone: <FaPalette />,
      cor: '#32CD32',
      resumo: 'Simplicidade, natureza e ideais neoclássicos',
      caracteristicas: [
        'Simplicidade e clareza',
        'Natureza idealizada (locus amoenus)',
        'Pastoralismo e bucolismo',
        'Pseudônimos greco-latinos',
        'Influência iluminista'
      ],
      autores: [
        {
          nome: 'Cláudio Manuel da Costa',
          obras: ['Obras Poéticas (1768)', 'Vila Rica'],
          importancia: 'Introdutor do Arcadismo no Brasil'
        },
        {
          nome: 'Tomás Antônio Gonzaga',
          obras: ['Marília de Dirceu', 'Cartas Chilenas'],
          importancia: 'Maior poeta árcade brasileiro'
        },
        {
          nome: 'Basílio da Gama',
          obras: ['O Uraguai (1769)'],
          importancia: 'Autor do grande épico árcade brasileiro'
        }
      ],
      contextoHistorico: 'Inconfidência Mineira, influência do Iluminismo, crise do sistema colonial.',
      curiosidades: [
        'Vários árcades participaram da Inconfidência Mineira',
        'Usavam pseudônimos como Dirceu, Glauceste Satúrnio',
        'Marília de Dirceu foi escrito na prisão'
      ]
    },
    {
      id: 'romantismo',
      nome: 'Romantismo',
      periodo: '1836-1881',
      icone: <FaBook />,
      cor: '#FF69B4',
      resumo: 'Nacionalismo, indianismo e sentimentalismo',
      caracteristicas: [
        'Nacionalismo e indianismo',
        'Sentimentalismo exacerbado',
        'Subjetivismo e individualismo',
        'Liberdade formal',
        'Escapismo e idealização'
      ],
      gerações: [
        {
          nome: '1ª Geração - Nacionalista/Indianista',
          periodo: '1836-1850',
          características: ['Exaltação da pátria', 'Indianismo', 'Natureza brasileira'],
          autores: ['Gonçalves Dias', 'Gonçalves de Magalhães']
        },
        {
          nome: '2ª Geração - Ultrarromântica/Byroniana',
          periodo: '1850-1860',
          características: ['Pessimismo', 'Morte', 'Amor impossível', 'Mal do século'],
          autores: ['Álvares de Azevedo', 'Casimiro de Abreu', 'Junqueira Freire']
        },
        {
          nome: '3ª Geração - Condoreira/Social',
          periodo: '1860-1881',
          características: ['Abolicionismo', 'Republicanismo', 'Poesia social'],
          autores: ['Castro Alves', 'Sousândrade']
        }
      ],
      autores: [
        {
          nome: 'Gonçalves Dias',
          obras: ['Canção do Exílio', 'I-Juca Pirama', 'Os Timbiras'],
          importancia: 'Maior poeta da 1ª geração romântica'
        },
        {
          nome: 'José de Alencar',
          obras: ['O Guarani', 'Iracema', 'Senhora', 'O Sertanejo'],
          importancia: 'Criador do romance brasileiro'
        },
        {
          nome: 'Castro Alves',
          obras: ['O Navio Negreiro', 'Vozes d\'África', 'Espumas Flutuantes'],
          importancia: 'O "Poeta dos Escravos"'
        },
        {
          nome: 'Álvares de Azevedo',
          obras: ['Lira dos Vinte Anos', 'Noite na Taverna'],
          importancia: 'Maior representante do ultrarromantismo'
        }
      ],
      contextoHistorico: 'Independência do Brasil, formação da identidade nacional, questões sociais como abolição.',
      curiosidades: [
        'A "Canção do Exílio" foi escrita em Coimbra por saudade do Brasil',
        'Castro Alves morreu aos 24 anos',
        'Iracema é um anagrama de América'
      ]
    },
    {
      id: 'realismo',
      nome: 'Realismo/Naturalismo',
      periodo: '1881-1893',
      icone: <FaIndustry />,
      cor: '#A0522D',
      resumo: 'Crítica social, objetividade e determinismo',
      características: [
        'Objetividade e imparcialidade',
        'Crítica social e política',
        'Psicologia das personagens',
        'Determinismo (Naturalismo)',
        'Linguagem simples e direta'
      ],
      autores: [
        {
          nome: 'Machado de Assis',
          obras: ['Memórias Póstumas de Brás Cubas', 'Dom Casmurro', 'O Cortiço'],
          importancia: 'Maior escritor brasileiro de todos os tempos'
        },
        {
          nome: 'Aluísio Azevedo',
          obras: ['O Cortiço', 'Casa de Pensão', 'O Mulato'],
          importancia: 'Principal representante do Naturalismo'
        },
        {
          nome: 'Raul Pompéia',
          obras: ['O Ateneu'],
          importancia: 'Romance de formação brasileiro'
        }
      ],
      contextoHistorico: 'Abolição da escravatura, Proclamação da República, modernização do país.',
      curiosidades: [
        'Machado de Assis fundou a Academia Brasileira de Letras',
        'O Cortiço é considerado o melhor romance naturalista brasileiro',
        'Dom Casmurro gerou polêmica sobre o adultério de Capitu'
      ]
    },
    {
      id: 'parnasianismo',
      nome: 'Parnasianismo',
      periodo: '1882-1893',
      icone: <FaFeather />,
      cor: '#4169E1',
      resumo: 'Arte pela arte, perfeição formal e objetividade',
      características: [
        'Arte pela arte',
        'Perfeição formal',
        'Objetividade',
        'Métrica e rima perfeitas',
        'Temática greco-latina'
      ],
      autores: [
        {
          nome: 'Olavo Bilac',
          obras: ['Panóplias', 'Via Láctea', 'Sarças de Fogo'],
          importancia: 'Príncipe dos Poetas Brasileiros'
        },
        {
          nome: 'Raimundo Correia',
          obras: ['Primeiros Sonhos', 'Sinfonias', 'Aleluias'],
          importancia: 'Mestre do soneto parnasiano'
        },
        {
          nome: 'Alberto de Oliveira',
          obras: ['Meridionais', 'Sonetos e Poemas'],
          importancia: 'Poeta da descrição precisa'
        }
      ],
      contextoHistorico: 'Mesmo período do Realismo, busca pela perfeição técnica em oposição ao sentimentalismo romântico.',
      curiosidades: [
        'Olavo Bilac foi também jornalista e educador',
        'O Parnasianismo valorizava a técnica sobre a emoção',
        'Influência do Parnaso francês'
      ]
    },
    {
      id: 'simbolismo',
      nome: 'Simbolismo',
      periodo: '1893-1922',
      icone: <FaPalette />,
      cor: '#9370DB',
      resumo: 'Subjetivismo, musicalidade e transcendência',
      características: [
        'Subjetivismo extremo',
        'Musicalidade dos versos',
        'Sinestesia',
        'Misticismo',
        'Linguagem sugestiva'
      ],
      autores: [
        {
          nome: 'Cruz e Sousa',
          obras: ['Missal', 'Broquéis', 'Faróis'],
          importancia: 'Maior poeta simbolista brasileiro'
        },
        {
          nome: 'Alphonsus de Guimaraens',
          obras: ['Setenário das Dores de Nossa Senhora', 'Câmara Ardente'],
          importancia: 'Poeta do misticismo religioso'
        }
      ],
      contextoHistorico: 'República Velha, urbanização, influências europeias modernas.',
      curiosidades: [
        'Cruz e Sousa era filho de escravos libertos',
        'Simbolismo foi contemporâneo ao Parnasianismo',
        'Movimento de transição para o Modernismo'
      ]
    },
    {
      id: 'premodernismo',
      nome: 'Pré-Modernismo',
      periodo: '1902-1922',
      icone: <FaBook />,
      cor: '#FF8C00',
      resumo: 'Transição, regionalismo e crítica social',
      características: [
        'Sincretismo de tendências',
        'Regionalismo',
        'Denúncia social',
        'Linguagem mais simples',
        'Temas nacionais'
      ],
      autores: [
        {
          nome: 'Euclides da Cunha',
          obras: ['Os Sertões'],
          importancia: 'Obra-prima da literatura brasileira'
        },
        {
          nome: 'Lima Barreto',
          obras: ['Triste Fim de Policarpo Quaresma', 'O Cortiço'],
          importancia: 'Crítico social e pioneiro da literatura afro-brasileira'
        },
        {
          nome: 'Monteiro Lobato',
          obras: ['Urupês', 'Cidades Mortas', 'Sítio do Picapau Amarelo'],
          importancia: 'Renovador da literatura infantil brasileira'
        }
      ],
      contextoHistorico: 'República Velha, Guerra de Canudos, imigração europeia, início da industrialização.',
      curiosidades: [
        'Os Sertões retrata a Guerra de Canudos',
        'Lima Barreto foi internado por alcoolismo',
        'Monteiro Lobato criou a primeira editora moderna do Brasil'
      ]
    },
    {
      id: 'modernismo',
      nome: 'Modernismo',
      periodo: '1922-1945',
      icone: <FaTheaterMasks />,
      cor: '#FF1493',
      resumo: 'Ruptura, experimentação e identidade nacional',
      características: [
        'Ruptura com o passado',
        'Liberdade formal',
        'Verso livre',
        'Linguagem coloquial',
        'Nacionalismo crítico'
      ],
      fases: [
        {
          nome: '1ª Fase - Heroica (1922-1930)',
          características: [
            'Destruição de valores tradicionais',
            'Espírito polêmico e irreverente',
            'Experimentação formal',
            'Antropofagia cultural',
            'Semana de Arte Moderna (1922)'
          ],
          autores: [
            {
              nome: 'Mário de Andrade',
              obras: ['Pauliceia Desvairada', 'Macunaíma'],
              importancia: 'Teórico do Modernismo brasileiro'
            },
            {
              nome: 'Oswald de Andrade',
              obras: ['Pau-Brasil', 'Manifesto Antropófago'],
              importancia: 'Criador da poesia pau-brasil'
            },
            {
              nome: 'Manuel Bandeira',
              obras: ['A Cinza das Horas', 'Libertinagem'],
              importancia: 'Poeta da simplicidade e cotidiano'
            }
          ]
        },
        {
          nome: '2ª Fase - Madura (1930-1945)',
          características: [
            'Consolidação das conquistas',
            'Preocupação social',
            'Romance de 30',
            'Regionalismo nordestino',
            'Amadurecimento técnico'
          ],
          autores: [
            {
              nome: 'Carlos Drummond de Andrade',
              obras: ['Alguma Poesia', 'Sentimento do Mundo'],
              importancia: 'Maior poeta brasileiro do século XX'
            },
            {
              nome: 'Graciliano Ramos',
              obras: ['Vidas Secas', 'São Bernardo', 'Memórias do Cárcere'],
              importancia: 'Mestre da prosa moderna brasileira'
            },
            {
              nome: 'Jorge Amado',
              obras: ['Gabriela, Cravo e Canela', 'Dona Flor e Seus Dois Maridos'],
              importancia: 'Escritor brasileiro mais traduzido no mundo'
            },
            {
              nome: 'Rachel de Queiroz',
              obras: ['O Quinze', 'Dora Doralina'],
              importancia: 'Primeira mulher na Academia Brasileira de Letras'
            }
          ]
        }
      ],
      contextoHistorico: 'Era Vargas, industrialização, urbanização, Segunda Guerra Mundial.',
      curiosidades: [
        'A Semana de 22 durou apenas 3 dias',
        'Macunaíma não tem caráter nenhum',
        'Graciliano Ramos foi preso político sem processo'
      ]
    },
    {
      id: 'contemporaneo',
      nome: 'Literatura Contemporânea',
      periodo: '1945-atualmente',
      icone: <FaBook />,
      cor: '#20B2AA',
      resumo: 'Diversidade, experimentação e temas universais',
      características: [
        'Pluralidade de tendências',
        'Metaliteratura',
        'Experimentação narrativa',
        'Temas urbanos e universais',
        'Influência da mídia'
      ],
      fases: [
        {
          nome: '3ª Fase Modernista (1945-1980)',
          características: [
            'Geração de 45',
            'Retorno à forma',
            'Universalismo',
            'Introspectivismo'
          ],
          autores: [
            {
              nome: 'Clarice Lispector',
              obras: ['A Hora da Estrela', 'Água Viva'],
              importancia: 'Renovadora da ficção brasileira'
            },
            {
              nome: 'Guimarães Rosa',
              obras: ['Grande Sertão: Veredas', 'Sagarana'],
              importancia: 'Revolucionou a linguagem literária'
            },
            {
              nome: 'João Cabral de Melo Neto',
              obras: ['Morte e Vida Severina', 'A Educação pela Pedra'],
              importancia: 'Poeta da objetividade e precisão'
            }
          ]
        },
        {
          nome: 'Literatura Atual (1980-presente)',
          características: [
            'Diversidade temática',
            'Literatura marginal',
            'Autoficção',
            'Narrativas urbanas',
            'Influência digital'
          ],
          autores: [
            {
              nome: 'Rubem Fonseca',
              obras: ['Feliz Ano Novo', 'O Cobrador'],
              importancia: 'Pioneiro da literatura urbana violenta'
            },
            {
              nome: 'Lygia Fagundes Telles',
              obras: ['Ciranda de Pedra', 'As Meninas'],
              importancia: 'Mestra do conto psicológico'
            },
            {
              nome: 'Conceição Evaristo',
              obras: ['Becos da Memória', 'Olhos d\'água'],
              importancia: 'Voz da literatura afro-brasileira contemporânea'
            }
          ]
        }
      ],
      contextoHistorico: 'Ditadura militar, redemocratização, globalização, era digital.',
      curiosidades: [
        'Clarice Lispector nasceu na Ucrânia',
        'Guimarães Rosa criou mais de 8.000 neologismos',
        'João Cabral nunca usou adjetivos desnecessários'
      ]
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const openModal = (periodo) => {
    setSelectedPeriod(periodo);
  };

  const closeModal = () => {
    setSelectedPeriod(null);
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Header da página */}
          <section className={styles.pageHeader}>
            <div className={styles.headerContent}>
              <h1 className={styles.pageTitle}>
                <FaBook /> História da Literatura Brasileira
              </h1>
              <p className={styles.pageDescription}>
                Explore a rica trajetória da literatura brasileira desde seus primórdios até os dias atuais. 
                Uma jornada cronológica através dos movimentos, autores e obras que moldaram nossa identidade cultural.
              </p>
            </div>
          </section>

          {/* Timeline dos períodos */}
          <section className={styles.timeline}>
            <h2 className={styles.sectionTitle}>Linha do Tempo Literária</h2>
            <div className={styles.timelineContainer}>
              {periodosLiterarios.map((periodo, index) => (
                <div 
                  key={periodo.id} 
                  className={styles.timelineItem}
                  onClick={() => openModal(periodo)}
                >
                  <div 
                    className={styles.timelineMarker}
                    style={{ backgroundColor: periodo.cor }}
                  >
                    {periodo.icone}
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <h3 className={styles.timelineTitle}>{periodo.nome}</h3>
                      <span className={styles.timelinePeriod}>
                        <FaCalendarAlt /> {periodo.periodo}
                      </span>
                    </div>
                    <p className={styles.timelineDescription}>{periodo.resumo}</p>
                    <div className={styles.timelineAuthors}>
                      <FaUser /> {periodo.autores.slice(0, 2).map(autor => autor.nome).join(', ')}
                      {periodo.autores.length > 2 && '...'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Seções expansíveis */}
          <section className={styles.periodsSection}>
            <h2 className={styles.sectionTitle}>Períodos Literários Detalhados</h2>
            {periodosLiterarios.map((periodo) => (
              <div key={periodo.id} className={styles.periodCard}>
                <div 
                  className={styles.periodHeader}
                  onClick={() => toggleSection(periodo.id)}
                  style={{ borderLeftColor: periodo.cor }}
                >
                  <div className={styles.periodInfo}>
                    <h3 className={styles.periodName}>
                      {periodo.icone} {periodo.nome}
                    </h3>
                    <span className={styles.periodDates}>{periodo.periodo}</span>
                  </div>
                  <div className={styles.expandIcon}>
                    {expandedSection === periodo.id ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>

                {expandedSection === periodo.id && (
                  <div className={styles.periodContent}>
                    <div className={styles.periodOverview}>
                      <h4>Características Principais</h4>
                      <ul className={styles.characteristicsList}>
                        {periodo.caracteristicas?.map((char, index) => (
                          <li key={index}>{char}</li>
                        )) || periodo.características?.map((char, index) => (
                          <li key={index}>{char}</li>
                        ))}
                      </ul>
                    </div>

                    {periodo.fases && (
                      <div className={styles.phases}>
                        <h4>Fases do {periodo.nome}</h4>
                        {periodo.fases.map((fase, index) => (
                          <div key={index} className={styles.phaseCard}>
                            <h5>{fase.nome}</h5>
                            <ul>
                              {fase.características.map((char, charIndex) => (
                                <li key={charIndex}>{char}</li>
                              ))}
                            </ul>
                            {fase.autores && (
                              <div className={styles.phaseAuthors}>
                                <strong>Principais autores:</strong>
                                {fase.autores.map((autor, autorIndex) => (
                                  <span key={autorIndex} className={styles.authorTag}>
                                    {autor.nome}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {periodo.gerações && (
                      <div className={styles.generations}>
                        <h4>Gerações do {periodo.nome}</h4>
                        {periodo.gerações.map((geracao, index) => (
                          <div key={index} className={styles.generationCard}>
                            <h5>{geracao.nome}</h5>
                            <p><strong>Período:</strong> {geracao.periodo}</p>
                            <ul>
                              {geracao.características.map((char, charIndex) => (
                                <li key={charIndex}>{char}</li>
                              ))}
                            </ul>
                            <div className={styles.generationAuthors}>
                              <strong>Principais autores:</strong>
                              {geracao.autores.map((autor, autorIndex) => (
                                <span key={autorIndex} className={styles.authorTag}>
                                  {autor}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className={styles.mainAuthors}>
                      <h4>Principais Autores e Obras</h4>
                      <div className={styles.authorsGrid}>
                        {periodo.autores.map((autor, index) => (
                          <div key={index} className={styles.authorCard}>
                            <h5>{autor.nome}</h5>
                            <p className={styles.authorImportance}>{autor.importancia}</p>
                            <div className={styles.authorWorks}>
                              <strong>Principais obras:</strong>
                              <ul>
                                {autor.obras.map((obra, obraIndex) => (
                                  <li key={obraIndex}>{obra}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={styles.historicalContext}>
                      <h4>Contexto Histórico</h4>
                      <p>{periodo.contextoHistorico}</p>
                    </div>

                    <div className={styles.curiosities}>
                      <h4>Curiosidades</h4>
                      <ul>
                        {periodo.curiosidades.map((curiosidade, index) => (
                          <li key={index}>{curiosidade}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        </div>

        {/* Modal de detalhes */}
        {selectedPeriod && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>
                  {selectedPeriod.icone} {selectedPeriod.nome}
                </h2>
                <button className={styles.closeButton} onClick={closeModal}>
                  <FaTimes />
                </button>
              </div>
              <div className={styles.modalContent}>
                <div className={styles.modalPeriod}>
                  <FaCalendarAlt /> {selectedPeriod.periodo}
                </div>
                <p className={styles.modalDescription}>{selectedPeriod.resumo}</p>
                
                <div className={styles.modalSection}>
                  <h3>Características</h3>
                  <ul>
                    {(selectedPeriod.caracteristicas || selectedPeriod.características)?.map((char, index) => (
                      <li key={index}>{char}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.modalSection}>
                  <h3>Principais Autores</h3>
                  <div className={styles.modalAuthors}>
                    {selectedPeriod.autores.slice(0, 3).map((autor, index) => (
                      <div key={index} className={styles.modalAuthor}>
                        <h4>{autor.nome}</h4>
                        <p>{autor.importancia}</p>
                        <div className={styles.modalWorks}>
                          {autor.obras.slice(0, 2).map((obra, obraIndex) => (
                            <span key={obraIndex} className={styles.workBadge}>
                              {obra}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.modalSection}>
                  <h3>Contexto Histórico</h3>
                  <p>{selectedPeriod.contextoHistorico}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
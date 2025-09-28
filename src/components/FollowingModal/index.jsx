import { useState, useEffect } from 'react';
import { FaTimes, FaUsers, FaHeart, FaUser, FaBook } from 'react-icons/fa';
import Link from 'next/link';
import apiService from '../../services/api';
import styles from './followingModal.module.css';

export default function FollowingModal({ isOpen, onClose }) {
  const [escritores, setEscritores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    populares: 0,
    totalLivros: 0
  });

  useEffect(() => {
    if (isOpen) {
      loadEscritoresSeguidos();
    }
  }, [isOpen]);

  const loadEscritoresSeguidos = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMeusEscritores();
      
      const escritoresList = response.escritores || [];
      setEscritores(escritoresList);
      
      // Calcular estatísticas
      const totalLivros = escritoresList.reduce((sum, escritor) => 
        sum + (escritor.totalLivros || 0), 0
      );
      
      const populares = escritoresList.filter(escritor => 
        (escritor.totalSeguidores || 0) > 10
      ).length;
      
      setStats({
        total: escritoresList.length,
        populares,
        totalLivros
      });
    } catch (error) {
      console.error('Erro ao carregar escritores seguidos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header do Modal */}
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <h2>
              <FaHeart className={styles.heartIcon} />
              Escritores que Sigo
            </h2>
            <p>Descubra os talentos que você acompanha</p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Estatísticas Rápidas */}
        <div className={styles.quickStats}>
          <div className={styles.quickStat}>
            <FaUsers className={styles.statIcon} />
            <div>
              <span className={styles.statNumber}>{stats.total}</span>
              <span className={styles.statLabel}>seguindo</span>
            </div>
          </div>
          
          <div className={styles.quickStat}>
            <FaHeart className={styles.statIcon} />
            <div>
              <span className={styles.statNumber}>{stats.populares}</span>
              <span className={styles.statLabel}>populares</span>
            </div>
          </div>
          
          <div className={styles.quickStat}>
            <FaBook className={styles.statIcon} />
            <div>
              <span className={styles.statNumber}>{stats.totalLivros}</span>
              <span className={styles.statLabel}>livros</span>
            </div>
          </div>
        </div>

        {/* Lista de Escritores */}
        <div className={styles.modalBody}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}>📚</div>
              <p>Carregando seus escritores...</p>
            </div>
          ) : escritores.length > 0 ? (
            <div className={styles.escritoresList}>
              {escritores.map((escritor) => (
                <div key={escritor.id} className={styles.escritorCard}>
                  <div className={styles.escritorImage}>
                    <img 
                      src={escritor.foto || '/autores/default.jpg'} 
                      alt={escritor.nome}
                      onError={(e) => {
                        e.target.src = '/autores/default.jpg';
                      }}
                    />
                    {(escritor.totalSeguidores || 0) > 10 && (
                      <div className={styles.popularBadge}>
                        <FaHeart />
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.escritorInfo}>
                    <Link 
                      href={`/autor/${escritor.id}`} 
                      className={styles.escritorName}
                      onClick={onClose}
                    >
                      {escritor.nome}
                    </Link>
                    
                    <div className={styles.escritorStats}>
                      <span className={styles.miniStat}>
                        <FaBook /> {escritor.totalLivros || 0} livros
                      </span>
                      <span className={styles.miniStat}>
                        <FaUsers /> {escritor.totalSeguidores || 0} seguidores
                      </span>
                    </div>
                    
                    {escritor.biografia && (
                      <p className={styles.escritorBio}>
                        {escritor.biografia.length > 100 
                          ? escritor.biografia.substring(0, 100) + '...'
                          : escritor.biografia
                        }
                      </p>
                    )}
                    
                    <div className={styles.followInfo}>
                      <FaHeart className={styles.followIcon} />
                      <span>Seguindo desde {new Date(escritor.seguidoEm || Date.now()).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noEscritores}>
              <FaUser className={styles.noEscritoresIcon} />
              <h3>Você ainda não segue nenhum escritor</h3>
              <p>Comece a seguir escritores para ver suas obras e novidades aqui!</p>
              <Link href="/autores" className={styles.exploreButton} onClick={onClose}>
                <FaUsers /> Explorar Escritores
              </Link>
            </div>
          )}
        </div>

        {/* Footer do Modal */}
        {escritores.length > 0 && (
          <div className={styles.modalFooter}>
            <Link href="/seguindo" className={styles.viewAllButton} onClick={onClose}>
              Ver Página Completa
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
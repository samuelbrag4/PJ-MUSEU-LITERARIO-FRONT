'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaBook, 
  FaHome, 
  FaBookOpen, 
  FaUser, 
  FaBars, 
  FaTimes,
  FaLightbulb,
  FaHeart,
  FaPlay
} from 'react-icons/fa';
import styles from './header.module.css';

export default function Header() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar se há usuário logado
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    // Fechar menu com ESC
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    // Prevenir scroll quando menu aberto
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/home" className={styles.logoLink}>
            <span className={styles.logoIcon}><FaBook /></span>
            <span className={styles.logoText}>Museu Literário</span>
          </Link>
        </div>

        {/* Menu Hambúrguer */}
        <button 
          className={styles.hamburgerButton}
          onClick={toggleMenu}
          aria-label="Menu de navegação"
        >
          <div className={`${styles.hamburgerLine} ${isMenuOpen ? styles.line1Open : ''}`}></div>
          <div className={`${styles.hamburgerLine} ${isMenuOpen ? styles.line2Open : ''}`}></div>
          <div className={`${styles.hamburgerLine} ${isMenuOpen ? styles.line3Open : ''}`}></div>
        </button>




      </div>

      {/* Menu Lateral Moderno */}
      <div className={`${styles.sideMenu} ${isMenuOpen ? styles.sideMenuOpen : ''}`}>
        <div className={styles.sideMenuContent}>
          {/* Header do Menu */}
          <div className={styles.sideMenuHeader}>
            <div className={styles.menuTitle}>
              <FaBook className={styles.menuTitleIcon} />
              <span>Navegação</span>
            </div>
            <button 
              className={styles.closeMenuButton}
              onClick={toggleMenu}
              aria-label="Fechar menu"
            >
              <FaTimes />
            </button>
          </div>

          {/* Links de Navegação */}
          <nav className={styles.sideNav}>
            <Link href="/home" className={styles.sideNavLink} onClick={toggleMenu}>
              <FaHome /> <span>Início</span>
            </Link>
            <Link href="/livros" className={styles.sideNavLink} onClick={toggleMenu}>
              <FaBookOpen /> <span>Livros</span>
            </Link>
            <Link href="/autores" className={styles.sideNavLink} onClick={toggleMenu}>
              <FaUser /> <span>Autores</span>
            </Link>
            <Link href="/curiosidades" className={styles.sideNavLink} onClick={toggleMenu}>
              <FaLightbulb /> <span>Curiosidades</span>
            </Link>
            <Link href="/favoritos" className={styles.sideNavLink} onClick={toggleMenu}>
              <FaHeart /> <span>Favoritos</span>
            </Link>
            
            {/* Separador para Apresentação */}
            <div className={styles.sideMenuDivider}></div>
            <Link href="/apresentacao" className={`${styles.sideNavLink} ${styles.presentationLink}`} onClick={toggleMenu}>
              <FaPlay /> <span>Modo Apresentação</span>
            </Link>
            
            {/* Seção do Usuário */}
            {user && (
              <>
                <div className={styles.sideMenuDivider}></div>
                <div className={styles.userSection}>
                  <div className={styles.userInfo}>
                    {user.foto ? (
                      <img 
                        src={user.foto} 
                        alt="Foto do usuário" 
                        className={styles.sideUserPhoto}
                      />
                    ) : (
                      <div className={styles.sideUserPlaceholder}>
                        {user.nome.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className={styles.userDetails}>
                      <span className={styles.userName}>{user.nome}</span>
                      <span className={styles.userType}>
                        {user.tipo === 'ESCRITOR' ? 'Escritor' : 'Leitor'}
                      </span>
                    </div>
                  </div>
                  
                  <Link href="/rotas/profile" className={styles.sideNavLink} onClick={toggleMenu}>
                    <FaUser /> <span>Meu Perfil</span>
                  </Link>
                  
                  <button 
                    onClick={() => { handleLogout(); toggleMenu(); }}
                    className={styles.logoutButton}
                  >
                    <FaTimes /> <span>Sair</span>
                  </button>
                </div>
              </>
            )}

            {!user && (
              <>
                <div className={styles.sideMenuDivider}></div>
                <Link href="/" className={styles.loginButton} onClick={toggleMenu}>
                  <FaUser /> <span>Entrar</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className={styles.menuOverlay} 
          onClick={toggleMenu}
        ></div>
      )}
    </header>
  );
}
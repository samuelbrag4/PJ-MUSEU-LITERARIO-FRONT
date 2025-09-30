'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  FaPlay,
  FaMapMarkerAlt
} from 'react-icons/fa';
import styles from './header.module.css';

export default function Header() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Função para obter o nome da página atual
  const getCurrentPageName = () => {
    const pathMap = {
      '/home': 'Início',
      '/livros': 'Livros',
      '/autores': 'Autores',
      '/curiosidades': 'Curiosidades',
      '/favoritos': 'Favoritos',
      '/apresentacao': 'Apresentação',
      '/rotas/profile': 'Meu Perfil',
      '/seguindo': 'Seguindo',
      '/not-found': 'Página não encontrada'
    };

    // Verifica rotas dinâmicas
    if (pathname?.startsWith('/autor/')) return 'Perfil do Autor';
    if (pathname?.startsWith('/livro/')) return 'Detalhes do Livro';
    if (pathname?.startsWith('/rotas/')) return 'Perfil';
    
    return pathMap[pathname] || 'Museu Literário';
  };

  // Função para obter o ícone da página atual
  const getCurrentPageIcon = () => {
    if (pathname?.startsWith('/autor/')) return <FaUser />;
    if (pathname?.startsWith('/livro/')) return <FaBookOpen />;
    if (pathname === '/home') return <FaHome />;
    if (pathname === '/livros') return <FaBookOpen />;
    if (pathname === '/autores') return <FaUser />;
    if (pathname === '/curiosidades') return <FaLightbulb />;
    if (pathname === '/favoritos') return <FaHeart />;
    if (pathname === '/apresentacao') return <FaPlay />;
    if (pathname?.startsWith('/rotas/')) return <FaUser />;
    
    return <FaBook />;
  };

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

        {/* Indicador da Página Atual */}
        <div className={styles.currentPage}>
          <FaMapMarkerAlt className={styles.currentPageMarker} />
          <div className={styles.currentPageInfo}>
            <span className={styles.currentPageIcon}>{getCurrentPageIcon()}</span>
            <span className={styles.currentPageName}>{getCurrentPageName()}</span>
          </div>
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
            <Link 
              href="/home" 
              className={`${styles.sideNavLink} ${pathname === '/home' ? styles.activeNavLink : ''}`} 
              onClick={toggleMenu}
            >
              <FaHome /> <span>Início</span>
            </Link>
            <Link 
              href="/livros" 
              className={`${styles.sideNavLink} ${pathname === '/livros' ? styles.activeNavLink : ''}`} 
              onClick={toggleMenu}
            >
              <FaBookOpen /> <span>Livros</span>
            </Link>
            <Link 
              href="/autores" 
              className={`${styles.sideNavLink} ${pathname === '/autores' ? styles.activeNavLink : ''}`} 
              onClick={toggleMenu}
            >
              <FaUser /> <span>Autores</span>
            </Link>
            <Link 
              href="/curiosidades" 
              className={`${styles.sideNavLink} ${pathname === '/curiosidades' ? styles.activeNavLink : ''}`} 
              onClick={toggleMenu}
            >
              <FaLightbulb /> <span>Curiosidades</span>
            </Link>
            <Link 
              href="/favoritos" 
              className={`${styles.sideNavLink} ${pathname === '/favoritos' ? styles.activeNavLink : ''}`} 
              onClick={toggleMenu}
            >
              <FaHeart /> <span>Favoritos</span>
            </Link>
            
            {/* Separador para Apresentação */}
            <div className={styles.sideMenuDivider}></div>
            <Link 
              href="/apresentacao" 
              className={`${styles.sideNavLink} ${styles.presentationLink} ${pathname === '/apresentacao' ? styles.activeNavLink : ''}`} 
              onClick={toggleMenu}
            >
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
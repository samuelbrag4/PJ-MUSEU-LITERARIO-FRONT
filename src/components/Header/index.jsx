'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './header.module.css';

export default function Header() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar se há usuário logado
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/home" className={styles.logoLink}>
            <span className={styles.logoIcon}>📚</span>
            <span className={styles.logoText}>Museu Literário</span>
          </Link>
        </div>

        {/* Menu de Navegação Desktop */}
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/home" className={styles.navLink}>
                🏠 Início
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/livros" className={styles.navLink}>
                📖 Livros
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/escritores" className={styles.navLink}>
                ✍️ Escritores
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/favoritos" className={styles.navLink}>
                ❤️ Favoritos
              </Link>
            </li>
          </ul>
        </nav>

        {/* Área do Usuário */}
        <div className={styles.userArea}>
          {user ? (
            <div className={styles.userMenu}>
              <button 
                className={styles.userButton}
                onClick={toggleUserMenu}
              >
                {user.foto ? (
                  <img 
                    src={user.foto} 
                    alt="Foto do usuário" 
                    className={styles.userPhoto}
                  />
                ) : (
                  <div className={styles.userAvatar}>
                    {user.nome?.charAt(0)?.toUpperCase() || '👤'}
                  </div>
                )}
                <span className={styles.userName}>{user.nome}</span>
                <span className={styles.dropdownArrow}>▼</span>
              </button>

              {isUserMenuOpen && (
                <div className={styles.userDropdown}>
                  <Link href="/profile" className={styles.dropdownItem}>
                    👤 Meu Perfil
                  </Link>
                  <Link href="/configuracoes" className={styles.dropdownItem}>
                    ⚙️ Configurações
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className={styles.dropdownItem}
                  >
                    🚪 Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/" className={styles.loginButton}>
                Entrar
              </Link>
              <Link href="/rotas/register" className={styles.registerButton}>
                Cadastrar
              </Link>
            </div>
          )}
        </div>

        {/* Menu Mobile */}
        <button 
          className={styles.mobileMenuButton}
          onClick={toggleMenu}
        >
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
        </button>
      </div>

      {/* Menu Mobile Expandido */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            <Link href="/home" className={styles.mobileNavLink}>
              🏠 Início
            </Link>
            <Link href="/livros" className={styles.mobileNavLink}>
              📖 Livros
            </Link>
            <Link href="/escritores" className={styles.mobileNavLink}>
              ✍️ Escritores
            </Link>
            <Link href="/favoritos" className={styles.mobileNavLink}>
              ❤️ Favoritos
            </Link>
            
            {user && (
              <>
                <hr className={styles.mobileDivider} />
                <Link href="/profile" className={styles.mobileNavLink}>
                  👤 Meu Perfil
                </Link>
                <Link href="/configuracoes" className={styles.mobileNavLink}>
                  ⚙️ Configurações
                </Link>
                <button 
                  onClick={handleLogout}
                  className={styles.mobileNavLink}
                >
                  🚪 Sair
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import Popup from '../components/Popup';
import apiService from '../services/api';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [popup, setPopup] = useState({ isVisible: false, type: '', message: '' });
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showPopup = (type, message) => {
    setPopup({ isVisible: true, type, message });
  };

  const hidePopup = () => {
    setPopup({ isVisible: false, type: '', message: '' });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiService.login(formData.email, formData.senha);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      showPopup('loading', 'Login realizado com sucesso! Redirecionando para a home...');
      
      setTimeout(() => {
        router.push('/home');
      }, 2000);
      
    } catch (error) {
      showPopup('error', error.message || 'Erro ao fazer login. Verifique suas credenciais.');
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.formSection}>
        <div className={styles.container}>
          <div className={styles.loginBox}>
            <hgroup className={styles.hgroup}>
              <h1 className={styles.title}>Login</h1>
              <h2 className={styles.subtitle}>Acesse sua conta</h2>
            </hgroup>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                  placeholder="Digite seu email"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="senha" className={styles.label}>Senha</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="senha"
                    name="senha"
                    value={formData.senha}
                    onChange={handleInputChange}
                    className={styles.passwordInput}
                    required
                    placeholder="Digite sua senha"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className={styles.passwordToggle}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <div className={styles.registerLink}>
              <p>Não tem uma conta? 
                <Link href="/rotas/register" className={styles.link}>
                  Criar conta
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.aboutSection}>
        <div className={styles.aboutContainer}>
          <h2 className={styles.aboutTitle}>Sobre o Museu Literário Brasileiro</h2>
          <div className={styles.aboutContent}>
            <p className={styles.aboutText}>
              O Museu Literário Brasileiro é uma plataforma digital dedicada à preservação 
              e celebração da rica tradição literária do Brasil. Nossa missão é conectar 
              leitores, escritores e pesquisadores em um espaço colaborativo de descoberta cultural.
            </p>
            
            <div className={styles.features}>
              <div className={styles.feature}>
                <h3>📚 Acervo Digital</h3>
                <p>Explore nossa vasta coleção de obras, biografias e análises literárias dos grandes mestres brasileiros.</p>
              </div>
              
              <div className={styles.feature}>
                <h3>✍️ Comunidade Ativa</h3>
                <p>Conecte-se com outros amantes da literatura, compartilhe resenhas e participe de discussões enriquecedoras.</p>
              </div>
              
              <div className={styles.feature}>
                <h3>🎓 Recursos Educacionais</h3>
                <p>Acesse materiais didáticos, guias de estudo e conteúdos especialmente criados para estudantes e educadores.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Popup 
        type={popup.type}
        message={popup.message}
        isVisible={popup.isVisible}
        onClose={hidePopup}
      />
    </main>
  );
}
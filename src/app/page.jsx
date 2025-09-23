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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validação básica
    if (!formData.email || !formData.senha) {
      showPopup('error', 'Preencha todos os campos.');
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.login(formData.email, formData.senha);
      
      // Salvar token no localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      showPopup('success', 'Login realizado com sucesso! Redirecionando...');
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/home');
      }, 2000);
      
    } catch (error) {
      showPopup('error', error.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <div className={styles.loginBox}>
            <hgroup className={styles.hgroup}>
              <h1 className={styles.title}>Museu Literário</h1>
              <h2 className={styles.subtitle}>Faça login para continuar</h2>
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
                    className={styles.input}
                    required
                    placeholder="Digite sua senha"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <div className={styles.registerLink}>
              <p>Não tem uma conta? 
                <Link href="/rotas/register" className={styles.link}>
                  Clique aqui para criar uma
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.aboutSection}>
            <h3 className={styles.aboutTitle}>🏛️ Bem-vindo ao Museu Literário Brasileiro</h3>
            <div className={styles.aboutContent}>
              <p>
                <strong>Uma homenagem à nossa rica literatura nacional.</strong>
              </p>
              <p>
                O Museu Literário é uma plataforma dedicada exclusivamente às <strong>obras brasileiras</strong>, 
                criada para valorizar nossa cultura e nossos talentosos escritores.
              </p>
              <div className={styles.features}>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>📚</span>
                  <span>Descubra obras clássicas e contemporâneas</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>✍️</span>
                  <span>Escritores podem adicionar suas obras</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>⭐</span>
                  <span>Salve suas obras favoritas</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🔍</span>
                  <span>Explore novos autores e gêneros</span>
                </div>
              </div>
              <p className={styles.mission}>
                <em>"Levando a literatura brasileira a todos, porque nossa cultura merece ser celebrada!"</em>
              </p>
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

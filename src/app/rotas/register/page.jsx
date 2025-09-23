'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './register.module.css';
import Popup from '../../../components/Popup';
import Footer from '../../../components/Footer';
import { apiService } from '../../../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    dataNascimento: '',
    genero: '',
    biografia: '',
    tipoUsuario: 'NORMAL',
    foto: null
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [popup, setPopup] = useState({ isVisible: false, type: '', message: '' });
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
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
      const response = await apiService.register(formData);
      
      if (response.success) {
        showPopup('loading', 'Usuário registrado com sucesso! Redirecionando para o login...');
        
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        showPopup('error', response.message || 'Erro ao registrar usuário');
        setLoading(false);
      }
      
    } catch (error) {
      showPopup('error', error.message || 'Erro ao criar conta. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <>
      <main className={styles.main}>
      <div className={styles.formSection}>
        <div className={styles.container}>
          <div className={styles.loginBox}>
            <hgroup className={styles.hgroup}>
              <h1 className={styles.title}>Criar Conta</h1>
              <h2 className={styles.subtitle}>Junte-se à nossa comunidade</h2>
            </hgroup>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="nome" className={styles.label}>Nome Completo</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                  placeholder="Digite seu nome completo"
                />
              </div>

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

              <div className={styles.inputGroup}>
                <label htmlFor="telefone" className={styles.label}>Telefone</label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Digite seu telefone"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="dataNascimento" className={styles.label}>Data de Nascimento</label>
                <input
                  type="date"
                  id="dataNascimento"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="genero" className={styles.label}>Gênero</label>
                <select
                  id="genero"
                  name="genero"
                  value={formData.genero}
                  onChange={handleInputChange}
                  className={styles.input}
                >
                  <option value="">Selecione...</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMININO">Feminino</option>
                  <option value="OUTRO">Outro</option>
                  <option value="NAO_INFORMAR">Prefiro não informar</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="tipoUsuario" className={styles.label}>Tipo de Usuário</label>
                <select
                  id="tipoUsuario"
                  name="tipoUsuario"
                  value={formData.tipoUsuario}
                  onChange={handleInputChange}
                  className={styles.input}
                >
                  <option value="NORMAL">Leitor</option>
                  <option value="ESCRITOR">Escritor</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="biografia" className={styles.label}>Biografia</label>
                <textarea
                  id="biografia"
                  name="biografia"
                  value={formData.biografia}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  rows="3"
                  placeholder="Conte um pouco sobre você..."
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="foto" className={styles.label}>Foto de Perfil</label>
                <input
                  type="file"
                  id="foto"
                  name="foto"
                  onChange={handleInputChange}
                  className={styles.fileInput}
                  accept="image/*"
                />
              </div>

              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </button>
            </form>

            <div className={styles.registerLink}>
              <p>Já tem uma conta? 
                <Link href="/" className={styles.link}>
                  Fazer login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.aboutSection}>
        <div className={styles.aboutContainer}>
          <h2 className={styles.aboutTitle}>Bem-vindo ao Museu Literário!</h2>
          <div className={styles.aboutContent}>
            <p className={styles.aboutText}>
              Descubra um mundo de histórias fascinantes e conecte-se com uma comunidade 
              apaixonada por literatura. Crie sua conta e comece sua jornada literária hoje mesmo.
            </p>
            
            <div className={styles.features}>
              <div className={styles.feature}>
                <h3>📚 Acesso a milhares de obras</h3>
                <p>Explore nossa vasta coleção digital com os grandes clássicos da literatura brasileira e mundial.</p>
              </div>
              
              <div className={styles.feature}>
                <h3>✍️ Publique suas próprias obras</h3>
                <p>Como escritor, você pode publicar seus livros e compartilhar sua criatividade com milhares de leitores.</p>
              </div>
              
              <div className={styles.feature}>
                <h3>👥 Conecte-se com outros leitores</h3>
                <p>Participe de uma comunidade ativa de leitores, escritores e amantes da literatura brasileira.</p>
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
    <Footer />
    </>
  );
}

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './register.module.css';
import Popup from '../../../components/Popup';
import apiService from '../../../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    nome: '',
    nomeUsuario: '',
    email: '',
    senha: '',
    nascimento: '',
    tipo: 'leitor',
    foto: null
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [popup, setPopup] = useState({ isVisible: false, type: '', message: '' });
  const [fotoPreview, setFotoPreview] = useState(null);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        foto: file
      }));

      const reader = new FileReader();
      reader.onload = () => {
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFoto = () => {
    setFormData(prev => ({
      ...prev,
      foto: null
    }));
    setFotoPreview(null);
    
    const fileInput = document.getElementById('foto');
    if (fileInput) {
      fileInput.value = '';
    }
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
      let fotoUrl = null;

      if (formData.foto) {
        try {
          const uploadResponse = await apiService.uploadFoto(formData.foto);
          
          // Converter caminho relativo em URI completa
          const relativePath = uploadResponse.url;
          fotoUrl = `http://localhost:5000${relativePath}`;
        } catch (uploadError) {
          showPopup('error', 'Erro ao fazer upload da foto. Continuando sem foto...');
        }
      }

      // Calcular idade baseada no ano de nascimento
      const currentYear = new Date().getFullYear();
      const idade = currentYear - parseInt(formData.nascimento);

      // Preparar dados para registro
      const registerData = {
        nome: formData.nome,
        nomeUsuario: formData.nomeUsuario,
        email: formData.email,
        senha: formData.senha,
        nascimento: parseInt(formData.nascimento),
        idade: idade,
        tipo: formData.tipo
      };

      // Só adicionar foto se houver URL válida
      if (fotoUrl) {
        registerData.foto = fotoUrl;
      }

      const response = await apiService.register(registerData);
      
      showPopup('loading', 'Conta criada com sucesso! Redirecionando para login...');
      
      setTimeout(() => {
        router.push('/');
      }, 2000);
      
    } catch (error) {
      showPopup('error', error.message || 'Erro ao criar conta. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.formSection}>
        <div className={styles.container}>
          <div className={styles.registerBox}>
            <hgroup className={styles.hgroup}>
              <h1 className={styles.title}>Criar Conta</h1>
              <h2 className={styles.subtitle}>Junte-se ao Museu Literário</h2>
            </hgroup>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row}>
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
                  <label htmlFor="nomeUsuario" className={styles.label}>Nome de Usuário</label>
                  <input
                    type="text"
                    id="nomeUsuario"
                    name="nomeUsuario"
                    value={formData.nomeUsuario}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                    placeholder="Digite um nome de usuário"
                  />
                </div>
              </div>

              <div className={styles.row}>
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
                  <label htmlFor="nascimento" className={styles.label}>Ano de Nascimento</label>
                  <input
                    type="number"
                    id="nascimento"
                    name="nascimento"
                    value={formData.nascimento}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                    min="1900"
                    max="2010"
                    placeholder="Ex: 1990"
                  />
                </div>
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
                    placeholder="Digite uma senha segura"
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
                <label htmlFor="tipo" className={styles.label}>Tipo de Usuário</label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="leitor">Leitor</option>
                  <option value="escritor">Escritor</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="foto" className={styles.label}>Foto de Perfil (Opcional)</label>
                <input
                  type="file"
                  id="foto"
                  name="foto"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                  accept="image/*"
                />
                
                {fotoPreview && (
                  <div className={styles.photoPreview}>
                    <img src={fotoPreview} alt="Preview da foto" className={styles.previewImage} />
                    <button
                      type="button"
                      onClick={removeFoto}
                      className={styles.removePhotoBtn}
                      aria-label="Remover foto"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </button>
            </form>

            <div className={styles.loginLink}>
              <p>Já tem uma conta? 
                <Link href="/" className={styles.link}>
                  Clique aqui para fazer login
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
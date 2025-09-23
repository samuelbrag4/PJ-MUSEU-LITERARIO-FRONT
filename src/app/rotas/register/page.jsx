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
    idade: '',
    tipo: 'NORMAL',
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
      
      // Preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setFotoPreview(e.target.result);
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
    // Limpar o input file
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let fotoUrl = null;
      
      // Upload da foto se existir
      if (formData.foto) {
        try {
          const uploadResponse = await apiService.uploadFoto(formData.foto);
          fotoUrl = uploadResponse.url;
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
      
      showPopup('success', 'Conta criada com sucesso! Redirecionando para login...');
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/');
      }, 2000);
      
    } catch (error) {
      showPopup('error', error.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
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
                  placeholder="Digite seu nome de usuário"
                />
              </div>
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
                  className={styles.input}
                  required
                  placeholder="Digite sua senha (mínimo 6 caracteres)"
                  minLength="6"
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

            <div className={styles.row}>
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
                  placeholder="Ex: 1995"
                  min="1900"
                  max={new Date().getFullYear()}
                />
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
                  <option value="NORMAL">Usuário Normal</option>
                  <option value="ESCRITOR">Escritor</option>
                </select>
              </div>
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
                <div className={styles.preview}>
                  <div className={styles.previewContainer}>
                    <img src={fotoPreview} alt="Preview" className={styles.previewImage} />
                    <button
                      type="button"
                      className={styles.removePhoto}
                      onClick={removeFoto}
                      aria-label="Remover foto"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
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

      <Popup 
        type={popup.type}
        message={popup.message}
        isVisible={popup.isVisible}
        onClose={hidePopup}
      />
    </main>
  );
}

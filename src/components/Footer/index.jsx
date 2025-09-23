'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './footer.module.css';

export default function Footer() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    mensagem: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode implementar a lógica para enviar o formulário
    console.log('Formulário enviado:', formData);
    alert('Mensagem enviada com sucesso!');
    setFormData({ nome: '', email: '', mensagem: '' });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Seção Principal do Footer */}
        <div className={styles.footerMain}>
          
          {/* Sobre a Página */}
          <div className={styles.aboutSection}>
            <div className={styles.logoSection}>
              <div className={styles.footerLogo}>
                <span className={styles.logoIcon}>📚</span>
                <span className={styles.logoText}>Museu Literário</span>
              </div>
              <p className={styles.aboutText}>
                Explore a rica tradição literária do Brasil através de nossa vasta coleção 
                de obras, biografias e análises dos grandes mestres da literatura nacional.
              </p>
            </div>
          </div>

          {/* Links de Navegação */}
          <div className={styles.linksSection}>
            <h3 className={styles.sectionTitle}>Navegação</h3>
            <nav className={styles.footerNav}>
              <Link href="/home" className={styles.footerLink}>
                🏠 Início
              </Link>
              <Link href="/rotas/livros" className={styles.footerLink}>
                📖 Acervo
              </Link>
              <Link href="/rotas/escritores" className={styles.footerLink}>
                ✍️ Escritores
              </Link>
              <Link href="/rotas/profile" className={styles.footerLink}>
                👤 Perfil
              </Link>
              <Link href="/rotas/favoritos" className={styles.footerLink}>
                ❤️ Favoritos
              </Link>
            </nav>
          </div>

          {/* Formulário de Contato */}
          <div className={styles.contactSection}>
            <h3 className={styles.sectionTitle}>Entre em Contato</h3>
            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="nome"
                  placeholder="Seu nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  name="email"
                  placeholder="Seu e-mail"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <textarea
                  name="mensagem"
                  placeholder="Sua mensagem"
                  value={formData.mensagem}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  rows="4"
                  required
                ></textarea>
              </div>
              <button type="submit" className={styles.submitBtn}>
                📤 Enviar Mensagem
              </button>
            </form>
          </div>
        </div>

        {/* Seção Inferior do Footer */}
        <div className={styles.footerBottom}>
          
          {/* Links Sociais */}
          <div className={styles.socialLinks}>
            <a 
              href="https://github.com/samuelbrag4" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <span className={styles.socialIcon}>🐙</span>
              GitHub
            </a>
            <a 
              href="https://linkedin.com/in/seu-perfil" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <span className={styles.socialIcon}>💼</span>
              LinkedIn
            </a>
          </div>

          {/* Direitos Autorais */}
          <div className={styles.copyright}>
            <p>© 2025 Museu Literário Brasileiro. Todos os direitos reservados.</p>
            <p className={styles.developedBy}>
              Desenvolvido com ❤️ por <strong>Samuel Braga</strong>
            </p>
          </div>

          {/* Links Legais */}
          <div className={styles.legalLinks}>
            <Link href="/privacidade" className={styles.legalLink}>
              Política de Privacidade
            </Link>
            <Link href="/termos" className={styles.legalLink}>
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

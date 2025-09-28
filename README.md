# 📚 Museu Literário - Frontend

Uma plataforma digital completa dedicada à literatura brasileira, desenvolvida com Next.js 15 e React 19, que conecta leitores e escritores em uma experiência interativa e social.

## 🌟 Sobre o Projeto

O **Museu Literário** é uma plataforma social para literatura que oferece:
- **Acervo Digital Completo**: Catálogo extenso de obras da literatura brasileira
- **Rede Social Literária**: Sistema de follows entre leitores e escritores 
- **Perfis Personalizados**: Perfis diferenciados para leitores e autores
- **Gestão de Obras**: Escritores podem publicar e gerenciar suas obras
- **Interface Moderna**: Design responsivo com animações e UX otimizada

## 🚀 Tecnologias Utilizadas

### Core Technologies
- **Next.js 15.5.3** - Framework React com App Router
- **React 19.1.0** - Biblioteca de interface do usuário
- **React DOM 19.1.0** - Renderização DOM otimizada

### UI/UX Libraries
- **React Icons 5.5.0** - Iconografia consistente
- **Ant Design 5.27.4** - Componentes UI avançados
- **CSS Modules** - Estilos componetizados e isolados
- **TailwindCSS 4.0** - Framework CSS utilitário

### HTTP & Data
- **Axios 1.12.2** - Cliente HTTP para APIs
- **React Toastify 11.0.5** - Notificações elegantes

### Development Tools
- **ESLint 9.0** - Linting e qualidade de código
- **PostCSS** - Processamento de CSS

## 🏗️ Estrutura Completa do Projeto

```
PJ-MUSEU-LITERARIO-FRONT/
├── .git/
├── .next/
├── node_modules/
├── public/
│   ├── fonts/
│   │   ├── Poppins-Bold.woff2
│   │   └── Poppins-Regular.woff2
│   └── icons/
│       └── favicon.ico
├── src/
│   ├── app/
│   │   ├── autor/
│   │   │   └── [id]/
│   │   │       ├── autor.module.css
│   │   │       └── page.jsx
│   │   ├── autores/
│   │   │   ├── autores.module.css
│   │   │   └── page.jsx
│   │   ├── curiosidades/
│   │   │   ├── curiosidades.module.css
│   │   │   └── page.jsx
│   │   ├── dashboard/
│   │   ├── home/
│   │   │   ├── home.module.css
│   │   │   └── page.jsx
│   │   ├── livro/
│   │   │   └── [id]/
│   │   │       ├── livro.module.css
│   │   │       └── page.jsx
│   │   ├── livros/
│   │   │   ├── livros.module.css
│   │   │   └── page.jsx
│   │   ├── rotas/
│   │   │   ├── [book]/
│   │   │   │   ├── [book].module.css
│   │   │   │   └── page.jsx
│   │   │   ├── login/
│   │   │   │   ├── login.module.css
│   │   │   │   └── page.jsx
│   │   │   ├── profile/
│   │   │   │   ├── page.jsx
│   │   │   │   └── profile.module.css
│   │   │   └── register/
│   │   │       ├── page.jsx
│   │   │       └── register.module.css
│   │   ├── seguindo/
│   │   │   ├── page.jsx
│   │   │   └── seguindo.module.css
│   │   ├── globals.css
│   │   ├── layout.jsx
│   │   ├── not-found.jsx
│   │   ├── not-found.module.css
│   │   ├── page.jsx
│   │   └── page.module.css
│   ├── components/
│   │   ├── CardBook/
│   │   │   ├── cardBook.module.css
│   │   │   └── index.jsx
│   │   ├── FollowButton/
│   │   │   ├── followButton.module.css
│   │   │   └── index.jsx
│   │   ├── FollowingModal/
│   │   │   ├── followingModal.module.css
│   │   │   └── index.jsx
│   │   ├── Footer/
│   │   │   ├── footer.module.css
│   │   │   └── index.jsx
│   │   ├── Header/
│   │   │   ├── header.module.css
│   │   │   └── index.jsx
│   │   └── Popup/
│   │       ├── index.jsx
│   │       └── popup.module.css
│   └── services/
│       └── api.js
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── README.md
```

## 📱 Páginas e Funcionalidades

### 🔐 Autenticação
- **Login** (`/`) - Página inicial com autenticação
- **Registro** (`/rotas/register`) - Cadastro de novos usuários
- **Tipos de usuário**: Leitor e Escritor

### 🏠 Dashboard
- **Home** (`/home`) - Dashboard principal com estatísticas
- **Busca avançada** - Filtros por gênero, ano, dificuldade
- **Recomendações personalizadas**

### 📚 Catálogo
- **Livros** (`/livros`) - Catálogo completo organizado por gêneros
- **Detalhes do Livro** (`/livro/[id]`) - Informações completas, autor, preço
- **Filtros avançados** - Por gênero, dificuldade, adaptações

### 👥 Autores
- **Lista de Autores** (`/autores`) - Catálogo de escritores
- **Perfil do Autor** (`/autor/[id]`) - Biografia, obras, estatísticas
- **Sistema de Follow** - Seguir/deixar de seguir autores

### 🔗 Rede Social
- **Seguindo** (`/seguindo`) - Escritores que você segue
- **Estatísticas sociais** - Seguidores, seguindo, interações
- **Modal de seguidos** - Interface Instagram-style

### 👤 Perfil
- **Perfil do Usuário** (`/rotas/profile`) - Edição de dados pessoais
- **Para Escritores**: Gestão completa de obras (CRUD)
- **Upload de fotos** - Foto de perfil personalizável
- **Estatísticas pessoais**

### 📖 Conteúdo
- **Curiosidades** (`/curiosidades`) - Conteúdo educacional sobre literatura

## 🔧 Componentes Principais

### Header
```jsx
// Navegação principal com menu hambúrguer responsivo
- Logo e branding
- Menu lateral deslizante  
- Links de navegação contextuais
- Área do usuário logado
- Modo responsivo para mobile
```

### CardBook
```jsx
// Card de livro reutilizável
- Imagem com fallback inteligente
- Informações: título, autor, ano, preço
- Tags de dificuldade e adaptações
- Links para detalhes
```

### FollowButton
```jsx
// Botão de seguir estilo Instagram
- Estados: Seguir / Seguindo
- Feedback visual hover
- Loading states
- Integração completa com API
```

### FollowingModal
```jsx
// Modal de escritores seguidos
- Lista completa de seguidos
- Estatísticas rápidas
- Cards de perfil
- Links diretos para autores
```

## 🌐 Integração com API

### Serviço Principal (`api.js`)
```javascript
// Base URL
const API_BASE_URL = 'http://localhost:5000';

// Funcionalidades principais:
- Autenticação JWT
- Verificação automática de token
- Interceptadores de requisição/resposta
- Tratamento centralizado de erros
- Logs detalhados para debugging
```

### Endpoints Principais
```javascript
// Autenticação
POST /login - Login do usuário
POST /register - Cadastro de usuário

// Usuários
GET /users/:id - Buscar usuário
PUT /users/:id - Atualizar usuário
POST /upload-foto - Upload de foto de perfil

// Livros
GET /livros - Listar todos os livros
GET /livros/:id - Buscar livro específico
GET /livros/por-genero - Livros agrupados por gênero
GET /livros/autor/:id - Livros de um autor
POST /livros - Criar novo livro (escritores)
PUT /livros/:id - Atualizar livro
DELETE /livros/:id - Deletar livro

// Autores/Escritores
GET /escritores - Listar escritores
GET /escritores/:id - Buscar escritor específico
POST /escritores/:id/seguir - Seguir escritor
DELETE /escritores/:id/seguir - Deixar de seguir
GET /escritores/:id/seguidores - Contar seguidores

// Social
GET /meus-escritores - Escritores que sigo
GET /estatisticas-sociais - Estatísticas do usuário
```

## 🎨 Design System

### Paleta de Cores
```css
/* Cores principais */
--primary-green: #4f8209;
--secondary-green: #a6f02b;
--light-green: #f8ffe6;
--gradient: linear-gradient(135deg, #4f8209, #a6f02b);

/* Tons neutros */
--white: #ffffff;
--light-gray: #f5f5f5;
--dark-gray: #333333;
```

### Tipografia
```css
/* Fonte principal */
font-family: 'Poppins', sans-serif;

/* Pesos disponíveis */
- Regular (400)
- Bold (700)
```

### Componentes de UI
- **Botões**: Múltiplos estilos (primary, secondary, danger)
- **Cards**: Efeitos de hover e sombras elegantes
- **Modais**: Animações de entrada/saída
- **Forms**: Validação visual e feedback

## 📱 Responsividade

### Breakpoints
```css
/* Mobile */
@media (max-width: 768px)

/* Tablet */
@media (max-width: 1024px)

/* Desktop */
@media (min-width: 1025px)
```

### Características Responsivas
- **Menu hambúrguer** para dispositivos móveis
- **Grid adaptativo** para cards e layouts
- **Imagens responsivas** com lazy loading
- **Typography scaling** para legibilidade

## 🔒 Autenticação e Segurança

### Sistema JWT
- **Token storage** em localStorage
- **Verificação automática** de expiração
- **Refresh automático** quando necessário
- **Proteção de rotas** sensíveis

### Validações
- **Frontend**: Validação de formulários em tempo real
- **Backend**: Validação de dados e autenticação
- **Sanitização**: Prevenção contra XSS

## 🚀 Como Executar

### Pré-requisitos
```bash
Node.js 16+ 
npm ou yarn
Backend rodando na porta 5000
```

### Instalação
```bash
# Clone o repositório
git clone [repository-url]

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev

# Acesse http://localhost:3000
```

### Build de Produção
```bash
# Build otimizado
npm run build

# Executar versão de produção
npm start
```

## 📊 Funcionalidades Sociais

### Sistema de Follows
- **Seguir/Deixar de seguir** escritores
- **Contagem de seguidores** em tempo real
- **Feed personalizado** baseado em quem você segue
- **Estatísticas sociais** detalhadas

### Interações
- **Modal de seguidos** com interface elegante
- **Notificações** para ações sociais
- **Perfis interativos** com informações detalhadas

## 🔧 Configurações

### Next.js Config
```javascript
// next.config.mjs
- App Router habilitado
- Otimizações de imagem
- Build otimizado
```

### ESLint Config
```javascript
// eslint.config.mjs  
- Regras do Next.js
- Padrões de código consistentes
- Verificação de hooks
```

## 🐛 Tratamento de Erros

### Frontend
- **Fallbacks inteligentes** para imagens 404
- **Estados de loading** em todas operações assíncronas
- **Mensagens de erro** amigáveis ao usuário
- **Logs detalhados** para debugging

### Rede
- **Retry automático** para falhas de rede
- **Timeout handling** para requisições lentas
- **Fallback offline** quando possível

## 🎯 Próximas Funcionalidades

### Planejado
- [ ] Sistema de resenhas e avaliações
- [ ] Chat entre usuários
- [ ] Notificações push
- [ ] Sistema de favoritos avançado
- [ ] Recomendações por IA
- [ ] Dark mode
- [ ] Internacionalização (i18n)

## 📈 Performance

### Otimizações
- **Next.js Image** para carregamento otimizado
- **CSS Modules** para bundle size reduzido
- **Code splitting** automático
- **Lazy loading** de componentes pesados

### Métricas
- **First Contentful Paint** < 1.5s
- **Time to Interactive** < 3s
- **Bundle size** otimizado
- **SEO score** > 90

## 👨‍💻 Desenvolvimento

### Padrões de Código
- **Functional Components** com hooks
- **CSS Modules** para estilos isolados
- **Async/await** para operações assíncronas
- **Error boundaries** para captura de erros

### Estrutura de Commits
```bash
feat: nova funcionalidade
fix: correção de bug
style: mudanças de estilo
refactor: refatoração de código
docs: documentação
```

## 📞 Suporte

Para dúvidas, sugestões ou relatórios de bugs:
- **Email**: [seu-email]
- **GitHub Issues**: [link-para-issues]
- **Documentação**: Este README

---

**Desenvolvido com ❤️ para a comunidade literária brasileira**

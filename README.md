# Coach AI API 🎵

Uma API robusta para assistente de estudos de música com integração de Inteligência Artificial usando OpenAI e Groq.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Deploy](#deploy)
- [Contribuição](#contribuição)

## 🎯 Sobre o Projeto

O Coach AI API é um backend completo para um assistente de estudos de música que utiliza Inteligência Artificial para responder perguntas sobre teoria musical, prática, técnicas, história, estilos musicais, instrumentos e produção musical.

### Funcionalidades Principais

- ✅ Autenticação de usuários com JWT
- ✅ Conversas com IA (OpenAI GPT-4 e Groq Llama)
- ✅ Sistema de fallback automático entre provedores de IA
- ✅ Persistência de conversas no MongoDB
- ✅ Middlewares robustos de erro e validação
- ✅ Configuração flexível de serviços de IA
- ✅ Documentação completa da API

## 🏗️ Arquitetura

O projeto segue uma arquitetura limpa com separação clara de responsabilidades:

```
src/
├── app/                    # Lógica de negócio
│   ├── service/           # Serviços (IA, autenticação, etc.)
│   └── usecase/           # Casos de uso da aplicação
├── infra/                 # Infraestrutura
│   ├── client/            # Clients externos (OpenAI, Groq)
│   ├── config/            # Configurações
│   └── database/          # Entidades e repositórios
├── interface/             # Controllers e rotas
├── middleware/            # Middlewares (auth, erro, validação)
├── errors/                # Classes de erro customizadas
├── types/                 # Tipos TypeScript
└── utils/                 # Utilitários
```

### Padrões Utilizados

- **Clean Architecture**: Separação entre lógica de negócio e infraestrutura
- **Repository Pattern**: Abstração do acesso a dados
- **Use Case Pattern**: Encapsulamento da lógica de negócio
- **Middleware Pattern**: Interceptação de requisições
- **Error Handling**: Tratamento centralizado de erros

## 🛠️ Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Linguagem tipada
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação stateless
- **bcrypt** - Hash de senhas
- **Zod** - Validação de schemas

### Inteligência Artificial
- **OpenAI API** - GPT-4 para conversas
- **Groq API** - Llama 3.3-70B para conversas
- **Fallback Automático** - Troca entre provedores

### Desenvolvimento
- **ts-node-dev** - Hot reload para TypeScript
- **dotenv** - Variáveis de ambiente
- **CORS** - Cross-origin resource sharing

## 📋 Pré-requisitos

- Node.js 18+ 
- MongoDB 5+
- Conta na OpenAI (opcional)
- Conta na Groq (opcional)

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/coach-ai-api.git
cd coach-ai-api
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

4. **Configure o arquivo .env**
```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de dados
MONGODB_URI=mongodb://localhost:27017/coach-ai

# JWT
JWT_SECRET=sua-chave-secreta-super-segura

# OpenAI (opcional)
ENABLE_OPENAI=true
OPENAI_API_KEY=sua-chave-openai

# Groq (opcional)
ENABLE_GROQ=true
GROQ_API_KEY=sua-chave-groq
```

5. **Inicie o MongoDB**
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

6. **Execute o projeto**
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## ⚙️ Configuração

### Serviços de IA

O projeto suporta múltiplos provedores de IA com fallback automático:

#### OpenAI
```env
ENABLE_OPENAI=true
OPENAI_API_KEY=sk-...
```

#### Groq
```env
ENABLE_GROQ=true
GROQ_API_KEY=gsk_...
```

### Configurações de Banco

```env
MONGODB_URI=mongodb://localhost:27017/coach-ai
```

### Segurança

```env
JWT_SECRET=chave-super-secreta-de-32-caracteres
```

## 📖 Uso

### Endpoints Principais

#### Autenticação
```bash
# Registro
POST /register
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}

# Login
POST /login
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

#### Conversas
```bash
# Criar mensagem
POST /conversations
Authorization: Bearer <token>
{
  "message": "Como funciona a escala pentatônica?",
  "provider": "openai"  # opcional: "openai" ou "groq"
}

# Listar conversas do usuário
GET /conversations/user
Authorization: Bearer <token>

# Listar todas as conversas (admin)
GET /conversations
Authorization: Bearer <token>
```

## 🔌 API Endpoints

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/login`    | Login de usuário |

### Conversas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/conversations` | Criar nova mensagem |
| GET | `/conversations/user` | Listar conversas do usuário |
| GET | `/conversations` | Listar todas as conversas |

### Usuários
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/users` | Perfil do usuário |
| POST | `/users` | Registrar novo usuário |
| PUT | `/users/:id` | Atualizar perfil |
| DELETE | `/users/:id` | Atualizar perfil |

### Health Check
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Status da API |

## 📁 Estrutura do Projeto

```
coach-ai-api/
├── src/
│   ├── app/                    # Lógica de negócio
│   │   ├── service/           # Serviços
│   │   │   ├── auth.service.ts
│   │   │   ├── conversation.service.ts
│   │   │   ├── groq.service.ts
│   │   │   ├── openai.service.ts
│   │   │   ├── token.service.ts
│   │   │   └── user.service.ts
│   │   └── usecase/           # Casos de uso
│   │       ├── auth.usecase.ts
│   │       ├── conversation.usecase.ts
│   │       ├── groq.usecase.ts
│   │       └── user.usecase.ts
│   ├── errors/                # Classes de erro
│   │   ├── base.error.ts
│   │   ├── email-already-exist.error.ts
│   │   └── unauthorized.error.ts
│   ├── infra/                 # Infraestrutura
│   │   ├── client/            # Clients externos
│   │   │   ├── groq-client.ts
│   │   │   └── openai-client.ts
│   │   ├── config/            # Configurações
│   │   │   ├── config.database.ts
│   │   │   └── services.config.ts
│   │   └── database/          # Banco de dados
│   │       ├── entities/      # Entidades
│   │       │   ├── message.ts
│   │       │   └── user.ts
│   │       └── repository/    # Repositórios
│   │           └── message.model.ts
│   ├── interface/             # Controllers e rotas
│   │   ├── auth/             # Autenticação
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.schema.ts
│   │   ├── conversation/     # Conversas
│   │   │   ├── conversation.controller.ts
│   │   │   └── conversation.routes.ts
│   │   ├── health-check/     # Health check
│   │   │   ├── health.controller.ts
│   │   │   └── health.routes.ts
│   │   └── user/             # Usuários
│   │       ├── user.controller.ts
│   │       ├── user.routes.ts
│   │       └── user.schema.ts
│   ├── middleware/            # Middlewares
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── types/                 # Tipos TypeScript
│   │   └── express/
│   │       └── index.d.ts
│   ├── utils/                 # Utilitários
│   │   ├── answer.ts
│   │   ├── generate-hash.ts
│   │   └── questions.ts
│   ├── index.ts              # Entry point
│   └── routes.ts             # Rotas principais
├── .env.example              # Exemplo de variáveis
├── .gitignore               # Arquivos ignorados
├── package.json             # Dependências
├── tsconfig.json            # Configuração TypeScript
└── README.md               # Documentação
```

## 🚀 Deploy

### Variáveis de Ambiente para Produção

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/coach-ai
JWT_SECRET=chave-super-secreta-de-producao
ENABLE_OPENAI=true
OPENAI_API_KEY=sk-...
ENABLE_GROQ=true
GROQ_API_KEY=gsk_...
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Hot reload
npm run build        # Build para produção
npm start           # Iniciar produção

# Linting
npm run lint        # Verificar código
npm run lint:fix    # Corrigir automaticamente
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Certifique-se de que o MongoDB está rodando
3. Verifique os logs do console para erros específicos
4. Abra uma issue no GitHub

---

**Desenvolvido com ❤️ para o estudo de música**
# 📚 Documentação Técnica - Coach AI API

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Backend - Node.js/Express](#backend---nodejsexpress)
4. [Banco de Dados](#banco-de-dados)
5. [Autenticação e Segurança](#autenticação-e-segurança)
6. [Inteligência Artificial](#inteligência-artificial)
7. [APIs e Endpoints](#apis-e-endpoints)
8. [Fluxos de Usuário](#fluxos-de-usuário)
9. [Estrutura do Projeto](#estrutura-do-projeto)
10. [Configuração e Deploy](#configuração-e-deploy)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O **Coach AI API** é uma API robusta para assistente de estudos de música que utiliza Inteligência Artificial para responder perguntas sobre teoria musical, prática, técnicas, história, estilos musicais, instrumentos e produção musical.

### Objetivos do Sistema
- Fornecer assistência musical personalizada via IA
- Permitir autenticação segura de usuários com JWT
- Manter histórico de conversas no MongoDB
- Suportar múltiplos provedores de IA com fallback automático
- Escalar horizontalmente com arquitetura limpa

---

## 🏗️ Arquitetura do Sistema

### Diagrama de Arquitetura
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Cliente)     │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   IA Services   │
                       │ OpenAI | Groq   │
                       └─────────────────┘
```

### Padrões Arquiteturais

- **Clean Architecture**: Separação entre lógica de negócio e infraestrutura
- **Repository Pattern**: Abstração do acesso a dados
- **Use Case Pattern**: Encapsulamento da lógica de negócio
- **Middleware Pattern**: Interceptação de requisições
- **Error Handling**: Tratamento centralizado de erros

### Tecnologias Utilizadas

#### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Linguagem tipada
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação stateless
- **bcrypt** - Hash de senhas
- **Zod** - Validação de schemas

#### Inteligência Artificial
- **OpenAI API** - GPT-4 para conversas
- **Groq API** - Llama 3.3-70B para conversas
- **Fallback Automático** - Troca entre provedores

#### Desenvolvimento
- **ts-node-dev** - Hot reload para TypeScript
- **dotenv** - Variáveis de ambiente
- **CORS** - Cross-origin resource sharing

---

## ⚙️ Backend - Node.js/Express

### Estrutura do Projeto
```
src/
├── app/                    # Lógica de negócio
│   ├── service/           # Serviços (IA, autenticação, etc.)
│   │   ├── auth.service.ts
│   │   ├── conversation.service.ts
│   │   ├── groq.service.ts
│   │   ├── openai.service.ts
│   │   ├── token.service.ts
│   │   └── user.service.ts
│   └── usecase/           # Casos de uso da aplicação
│       ├── auth.usecase.ts
│       ├── conversation.usecase.ts
│       ├── groq.usecase.ts
│       └── user.usecase.ts
├── errors/                # Classes de erro customizadas
│   ├── base.error.ts
│   ├── email-already-exist.error.ts
│   └── unauthorized.error.ts
├── infra/                 # Infraestrutura
│   ├── client/            # Clients externos (OpenAI, Groq)
│   │   ├── groq-client.ts
│   │   └── openai-client.ts
│   ├── config/            # Configurações
│   │   ├── config.database.ts
│   │   └── services.config.ts
│   └── database/          # Banco de dados
│       ├── entities/      # Entidades
│       │   ├── message.ts
│       │   └── user.ts
│       └── repository/    # Repositórios
│           └── message.model.ts
├── interface/             # Controllers e rotas
│   ├── auth/             # Autenticação
│   │   ├── auth.controller.ts
│   │   ├── auth.routes.ts
│   │   └── auth.schema.ts
│   ├── conversation/     # Conversas
│   │   ├── conversation.controller.ts
│   │   └── conversation.routes.ts
│   ├── health-check/     # Health check
│   │   ├── health.controller.ts
│   │   └── health.routes.ts
│   └── user/             # Usuários
│       ├── user.controller.ts
│       ├── user.routes.ts
│       └── user.schema.ts
├── middleware/            # Middlewares
│   ├── auth.middleware.ts
│   └── error.middleware.ts
├── types/                 # Tipos TypeScript
│   └── express/
│       └── index.d.ts
├── utils/                 # Utilitários
│   ├── answer.ts
│   ├── generate-hash.ts
│   └── questions.ts
├── index.ts              # Entry point
└── routes.ts             # Rotas principais
```

### Camadas da Aplicação

#### 1. Interface Layer (Controllers)
Responsável por receber requisições HTTP e retornar respostas.

**Exemplo - AuthController:**
```typescript
export class AuthController {
  private useCase: AuthUseCase;

  constructor() {
    this.useCase = new AuthUseCase();
  }

  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const result = await this.useCase.register(name, email, password);
      res.status(201).json(result);
    } catch (error) {
      // Tratamento de erro
    }
  }
}
```

#### 2. Use Case Layer
Contém a lógica de negócio da aplicação.

**Exemplo - ConversationUseCase:**
```typescript
export class ConversationUseCase {
  private service: ConversationService;
  private groqService: GroqService;
  private openaiService: OpenAIService;

  async createMessage(message: string, userId: string, provider?: 'groq' | 'openai') {
    // Lógica de negócio para criar mensagem
    // Fallback automático entre provedores de IA
  }
}
```

#### 3. Service Layer
Implementa operações específicas como integração com APIs externas.

**Exemplo - GroqService:**
```typescript
export class GroqService {
  async execute(query: string): Promise<string> {
    if (!servicesConfig.groq.enabled) {
      throw new Error("Serviço Groq está desabilitado");
    }
    
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "Você é um assistente de estudos de música..." },
        { role: "user", content: query }
      ]
    });

    return completion.choices[0].message.content;
  }
}
```

#### 4. Infrastructure Layer
Gerencia conexões externas e persistência de dados.

### Middlewares

#### AuthMiddleware
```typescript
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedError('Token não fornecido');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    next(new UnauthorizedError('Token inválido'));
  }
};
```

#### ErrorMiddleware
```typescript
export const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);
  
  if (error instanceof BaseError) {
    return res.status(error.statusCode).json({
      error: error.message,
      statusCode: error.statusCode
    });
  }
  
  return res.status(500).json({
    error: 'Erro interno do servidor',
    statusCode: 500
  });
};
```

---

## 🗄️ Banco de Dados

### MongoDB
- **Database**: `coach-ai`
- **Collections**: `users`, `conversations`
- **Indexes**: Email único para usuários

### Modelos de Dados

#### User Entity
```typescript
export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Message Entity
```typescript
export interface Message {
  _id: string;
  userId: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: Date;
}
```

### Conexão
```typescript
mongoose.connect(process.env.MONGODB_URI!, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

---

## 🔐 Autenticação e Segurança

### JWT (JSON Web Tokens)
- **Algoritmo**: HS256
- **Expiração**: Configurável via variável de ambiente
- **Refresh**: Implementação futura

### Hash de Senhas
- **Algoritmo**: bcrypt
- **Salt Rounds**: 10

### Validação de Dados
- **Biblioteca**: Zod
- **Schemas**: Validação de entrada em todos os endpoints

### CORS
- Configurado para permitir requisições cross-origin
- Headers personalizados para autenticação

---

## 🤖 Inteligência Artificial

### Provedores Suportados

#### OpenAI
- **Modelo**: GPT-4
- **Configuração**: `ENABLE_OPENAI=true` + `OPENAI_API_KEY`
- **Prompt**: Assistente especializado em música

#### Groq
- **Modelo**: Llama 3.3-70B Versatile
- **Configuração**: `ENABLE_GROQ=true` + `GROQ_API_KEY`
- **Prompt**: Assistente especializado em música

### Sistema de Fallback
```typescript
// Tenta OpenAI primeiro, depois Groq
try {
  answer = await this.openaiService.execute(message);
} catch (error) {
  console.log("OpenAI falhou, tentando Groq...");
  answer = await this.groqService.execute(message);
}
```

### Configuração de Serviços
```typescript
export const servicesConfig = {
  groq: {
    enabled: process.env.ENABLE_GROQ === "true" && !!process.env.GROQ_API_KEY,
    apiKey: process.env.GROQ_API_KEY || "",
    name: "Groq"
  },
  openai: {
    enabled: process.env.ENABLE_OPENAI === "true" && !!process.env.OPENAI_API_KEY,
    apiKey: process.env.OPENAI_API_KEY || "",
    name: "OpenAI"
  }
};
```

---

## 🔌 APIs e Endpoints

### Autenticação
| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| POST | `/auth/register` | Registrar usuário | `{name, email, password}` |
| POST | `/auth/login` | Login | `{email, password}` |

### Conversas
| Método | Endpoint | Descrição | Headers |
|--------|----------|-----------|---------|
| POST | `/conversations` | Criar mensagem | `Authorization: Bearer <token>` |
| GET | `/conversations` | Listar conversas do usuário | `Authorization: Bearer <token>` |
| GET | `/conversations/all` | Listar todas (admin) | `Authorization: Bearer <token>` |

### Usuários
| Método | Endpoint | Descrição | Headers |
|--------|----------|-----------|---------|
| GET | `/users/profile` | Perfil do usuário | `Authorization: Bearer <token>` |
| PUT | `/users/profile` | Atualizar perfil | `Authorization: Bearer <token>` |

### Health Check
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Status da API |

### Exemplos de Uso

#### Registro de Usuário
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "senha123"
  }'
```

#### Criar Mensagem
```bash
curl -X POST http://localhost:3000/conversations \
  -H "Authorization: Bearer <seu-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Como funciona a escala pentatônica?",
    "provider": "openai"
  }'
```

---

## 🔄 Fluxos de Usuário

### 1. Registro e Login
```
Usuário → POST /auth/register → Validação → Hash da senha → Salva no DB → Retorna JWT
Usuário → POST /auth/login → Validação → Verifica senha → Retorna JWT
```

### 2. Conversa com IA
```
Usuário → POST /conversations → Auth Middleware → Use Case → Service IA → Salva resposta → Retorna conversa
```

### 3. Fallback de IA
```
OpenAI falha → Log do erro → Tenta Groq → Se falhar → Retorna erro amigável
```

---

## ⚙️ Configuração e Deploy

### Variáveis de Ambiente

#### Obrigatórias
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/coach-ai
JWT_SECRET=sua-chave-secreta-super-segura
```

#### Opcionais (IA)
```env
ENABLE_OPENAI=true
OPENAI_API_KEY=sk-...
ENABLE_GROQ=true
GROQ_API_KEY=gsk_...
```

### Scripts Disponíveis
```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Build para produção
npm start           # Iniciar produção
npm run lint        # Verificar código
npm run lint:fix    # Corrigir automaticamente
```

### Deploy em Produção
1. Configure variáveis de ambiente
2. Execute `npm run build`
3. Execute `npm start`
4. Configure proxy reverso (nginx/apache)
5. Configure SSL/TLS

---

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Erro de Conexão com MongoDB
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solução**: Verifique se o MongoDB está rodando

#### 2. Erro de JWT
```
Error: JWT_SECRET is not defined
```
**Solução**: Configure a variável JWT_SECRET no .env

#### 3. Erro de IA
```
Error: Serviço OpenAI está desabilitado
```
**Solução**: Configure ENABLE_OPENAI=true e OPENAI_API_KEY

#### 4. Erro de Validação
```
Error: Validation failed
```
**Solução**: Verifique o formato dos dados enviados

### Logs e Debug
- Logs estruturados no console
- Status dos serviços de IA no startup
- Middleware de erro centralizado

### Monitoramento
- Health check endpoint
- Logs de erro estruturados
- Status dos serviços de IA

---

## 🚀 Roadmap

### Próximas Funcionalidades
- [ ] Testes unitários e de integração
- [ ] Rate limiting para APIs de IA
- [ ] Cache de respostas
- [ ] Sistema de logs estruturado
- [ ] Documentação com Swagger
- [ ] Docker container
- [ ] CI/CD pipeline
- [ ] Monitoramento e métricas
- [ ] Refresh tokens
- [ ] Upload de arquivos de áudio
- [ ] Análise de progresso do usuário

---

**Documentação atualizada em: Dezembro 2024** 
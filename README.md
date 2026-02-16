# 🌌 Multiverse Data Explorer

Plataforma unificada para explorar, comparar e descobrir personagens de múltiplos universos. Pokémon, Digimon e muito mais em uma única aplicação!

[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.2-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**🌐 [Demo ao Vivo](#)** | **📖 [Documentação Completa](DOCUMENTATION.md)** | **⚡ [Quick Start](QUICK_START.md)**

---

## 📋 Sobre o Projeto

Uma aplicação full-stack moderna que integra APIs públicas de diferentes universos (Pokémon, Digimon) em uma plataforma unificada para exploração e comparação de dados.

**Por que este projeto se destaca:**
- 🎨 **Design Sci-Fi/Futurista** - Interface estilo Matrix/Cyberpunk
- ⚡ **Performance** - Cache inteligente com Caffeine
- 📊 **Visualizações Épicas** - Gráficos Radar para comparação
- 🔄 **APIs Integradas** - PokeAPI + Digimon API
- 🎯 **Comparação Cross-Universe** - Compare Pikachu vs Agumon!
- 🎮 **UX Gamificada** - Animações e efeitos visuais

---

## ✨ Funcionalidades

### 🎮 Exploração de Universos

| Universo | Status | Features |
|----------|--------|----------|
| **Pokémon** | ✅ | 898+ personagens, stats completos, tipos |
| **Digimon** | ✅ | 250+ personagens, níveis evolutivos |
| **Yu-Gi-Oh** | 🔜 | Em breve |
| **Dragon Ball** | 🔜 | Planejado |

### 🔥 Features Principais

- ✅ **Navegação por Universo** - Alterne entre Pokémon e Digimon
- ✅ **Busca em Tempo Real** - Filtre personagens instantaneamente
- ✅ **Comparação Visual** - Gráficos Radar lado a lado
- ✅ **Stats Unificados** - Estrutura padronizada para todos os universos
- ✅ **Cache Inteligente** - Respostas rápidas sem sobrecarregar APIs
- ✅ **Interface Futurista** - Design cyberpunk com animações Framer Motion
- ✅ **Responsivo** - Funciona em desktop, tablet e mobile

### 🎨 Firulas Visuais (DIFERENCIAIS!)

- 🌟 **Background Animado** - Grid pattern estilo Matrix
- 🎭 **Cards Interativos** - Hover effects e transições suaves
- 📊 **Gráficos Radar** - Comparação visual de stats com Recharts
- ⚡ **Seleção Múltipla** - Visual feedback ao selecionar personagens
- 🎪 **Modal Épico** - Tela de comparação full-screen
- 🏆 **Vencedor Destacado** - Badge dourado para o mais forte
- 🎨 **Cores por Tipo** - Visual coding para tipos/elementos

---

## 🚀 Tecnologias

### Backend (API REST)
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **Java** | 17 | Linguagem de programação |
| **Spring Boot** | 3.2.2 | Framework backend |
| **Spring Cache** | 3.2.2 | Caching |
| **Caffeine** | 3.1.8 | Cache em memória |
| **RestTemplate** | - | Cliente HTTP |
| **SpringDoc OpenAPI** | 2.3.0 | Documentação Swagger |
| **Lombok** | - | Redução de boilerplate |

### Frontend (Interface Web)
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **React** | 18 | Biblioteca UI |
| **TypeScript** | 5.3 | Type safety |
| **Vite** | 5.0 | Build tool moderna |
| **Tailwind CSS** | 3.4 | Estilização utility-first |
| **Framer Motion** | 11.0 | Animações suaves |
| **Recharts** | 2.10 | Gráficos de radar |
| **React Icons** | 5.0 | Ícones |
| **Axios** | 1.6 | Cliente HTTP |

---

## 🏗️ Arquitetura

### Fluxo de Dados

```
┌─────────────────────────────────────┐
│   Frontend React (Port 3000)        │
│   ├── Interface Futurista           │
│   ├── Seletor de Universo           │
│   ├── Grid de Personagens           │
│   └── Modal de Comparação           │
└──────────────┬──────────────────────┘
               │ HTTP REST
               ▼
┌─────────────────────────────────────┐
│  Backend Spring Boot (Port 8080)    │
│   ├── MultiverseController          │
│   ├── MultiverseService             │
│   └── Cache Layer (Caffeine)        │
└──────────────┬──────────────────────┘
               │
      ┌────────┴────────┐
      ▼                 ▼
┌──────────┐      ┌──────────┐
│ PokeAPI  │      │ Digimon  │
│ (Externo)│      │   API    │
└──────────┘      └──────────┘
```

### Estrutura Unificada de Dados

```java
Character {
  id: String
  name: String
  universe: POKEMON | DIGIMON
  types: String[]
  stats: Map<String, Integer>
  abilities: String[]
  imageUrl: String
  evolutionChain: String[]
}
```

---

## 🔧 Instalação e Execução

### Pré-requisitos

```bash
java -version    # Java 17+
node -v          # Node.js 18+
npm -v           # npm 9+
```

### Quick Start

#### 1️⃣ Clone o repositório
```bash
git clone https://github.com/DiegoRapichan/multiverse-explorer.git
cd multiverse-explorer
```

#### 2️⃣ Backend (Terminal 1)
```bash
cd backend
./mvnw clean install -DskipTests
./mvnw spring-boot:run
```
✅ Backend: `http://localhost:8080`  
📚 Swagger: `http://localhost:8080/swagger-ui.html`

#### 3️⃣ Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend: `http://localhost:3000`

---

## 📚 Endpoints da API

### Base URL
```
http://localhost:8080/api/multiverse
```

### Endpoints Disponíveis

#### 📋 Listar Universos
```http
GET /universes
```

**Response:**
```json
[
  {
    "id": "POKEMON",
    "name": "Pokémon",
    "apiUrl": "https://pokeapi.co/api/v2"
  },
  {
    "id": "DIGIMON",
    "name": "Digimon",
    "apiUrl": "https://digimon-api.vercel.app/api/digimon"
  }
]
```

#### 🎮 Listar Personagens
```http
GET /{universe}/characters?limit=20
```

**Exemplo:** `/POKEMON/characters?limit=50`

#### 🔍 Buscar Personagem
```http
GET /{universe}/characters/{name}
```

**Exemplo:** `/POKEMON/characters/pikachu`

#### ⚔️ Comparar Personagens
```http
POST /compare?universe1=POKEMON&name1=charizard&universe2=DIGIMON&name2=agumon
```

**Response:**
```json
{
  "character1": { ... },
  "character2": { ... },
  "statsDifference": {
    "attack": {
      "value1": 84,
      "value2": 75,
      "difference": 9,
      "advantage": "character1"
    }
  },
  "winner": "Charizard",
  "totalDifference": 45,
  "recommendation": "Charizard é mais forte no geral!"
}
```

---

## 💡 Exemplos de Uso

### Exemplo 1: Comparar Pikachu vs Agumon

```typescript
// Frontend
const result = await multiverseService.compareCharacters(
  'POKEMON', 'pikachu',
  'DIGIMON', 'agumon'
);

// Resultado: Gráfico radar mostrando vantagens de cada um
```

### Exemplo 2: Buscar todos os Pokémon tipo Fire

```typescript
const pokemon = await multiverseService.getCharacters('POKEMON', 150);
const fireTypes = pokemon.filter(p => p.types.includes('fire'));
```

---

## 📁 Estrutura do Projeto

```
multiverse-explorer/
│
├── backend/                          # 🔧 Backend Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/multiverse/
│   │   │   │   ├── config/           # CORS, Cache, Swagger
│   │   │   │   ├── controller/       # REST Controllers
│   │   │   │   ├── service/          # Integração APIs
│   │   │   │   ├── model/            # Character, Universe
│   │   │   │   ├── dto/              # ComparisonResult
│   │   │   │   └── MultiverseExplorerApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml
│   └── README.md
│
├── frontend/                         # 🎨 Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   └── MultiverseExplorer.tsx  # Componente principal
│   │   ├── services/
│   │   │   └── api.ts                  # Cliente HTTP
│   │   ├── types/
│   │   │   └── index.ts                # TypeScript types
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── README.md
│
├── README.md                         # 📖 Este arquivo
├── DOCUMENTATION.md                  # 📚 Docs técnicas
└── QUICK_START.md                   # ⚡ Guia rápido
```

---

## 🎯 Roadmap

### ✅ MVP Completo (Concluído)
- [x] Backend Spring Boot com cache
- [x] Integração PokeAPI
- [x] Integração Digimon API
- [x] Frontend React futurista
- [x] Comparação de personagens
- [x] Gráficos Radar
- [x] Swagger UI

### 🚀 Próximas Features (Semanas 5-8)

#### Semana 5-6: Mais Universos
- [ ] Yu-Gi-Oh API
- [ ] Dragon Ball API
- [ ] Rick and Morty API
- [ ] Marvel/DC Comics

#### Semana 7: ML/IA
- [ ] Modelo de previsão de batalha
- [ ] Recomendação de times
- [ ] Análise de matchups

#### Semana 8: Finalização
- [ ] Testes unitários (JUnit + Jest)
- [ ] Deploy completo
- [ ] GIFs/Screenshots
- [ ] Documentação final

---

## 🧪 Testes

### Backend
```bash
cd backend
./mvnw test
```

### Frontend
```bash
cd frontend
npm test
```

---

## 🚀 Deploy

### Backend - Railway/Heroku
```bash
# Railway
railway up

# Heroku
heroku create multiverse-explorer-api
git push heroku main
```

### Frontend - Vercel/Netlify
```bash
# Vercel
cd frontend
npm run build
vercel --prod

# Netlify
npm run build
netlify deploy --prod --dir=dist
```

---

## 👨‍💻 Autor

**Diego Colombari Rapichan**

Desenvolvedor Full Stack especializado em Java/Spring Boot e React.

- 🌐 GitHub: [@DiegoRapichan](https://github.com/DiegoRapichan)
- 💼 LinkedIn: [Diego Rapichan](https://linkedin.com/in/diego-rapichan)
- 📧 Email: direrapichan@gmail.com
- 📍 Localização: Apucarana, PR - Brasil

### 🎓 Formação

- **Bacharelado** em Sistemas de Informação
- **Pós-graduação** em Desenvolvimento OO com Java
- **Pós-graduação** em Desenvolvimento de Aplicações Web (em andamento)
- **Pós-graduação** em IA e Machine Learning (em andamento)

### 💼 Outros Projetos

- 📷 [**Image Resizer Pro**](https://github.com/DiegoRapichan/image-resizer) - Java + React  
  Redimensionamento e otimização de imagens com filtros
  
- 🔄 [**File Converter API**](https://github.com/DiegoRapichan/java-file-converter) - Java + Angular  
  Conversão entre 7 formatos (CSV, JSON, XML, Excel, PDF)
  
- 🏭 [**Autoflex Inventory**](https://github.com/DiegoRapichan/autoflex-inventory-system) - Spring + React  
  Sistema de gestão de estoque com IA

---

## 📜 Licença

Este projeto está sob a licença MIT.

---

## 🙏 Agradecimentos

- **PokeAPI Team** - API pública incrível
- **Digimon API Team** - Dados completos de Digimon
- **Spring Boot Team** - Framework excelente
- **React Team** - UI library moderna
- **Recharts** - Gráficos lindos

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela!**

**Desenvolvido com ❤️ por [Diego Rapichan](https://github.com/DiegoRapichan)**

[⬆ Voltar ao topo](#-multiverse-data-explorer)

</div>

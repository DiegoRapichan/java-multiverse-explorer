# 🌌 Multiverse Data Explorer

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://java-multiverse-explorer.vercel.app/)
[![API Docs](https://img.shields.io/badge/API-Docs-blue?style=for-the-badge&logo=swagger)](https://multiverse-explorer-api.onrender.com/swagger-ui.html)

[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.2-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

> Plataforma unificada para explorar, comparar e descobrir personagens de **58 universos de anime**. Pokémon, Digimon, Dragon Ball, Naruto, One Piece e muito mais em uma única aplicação!

**🌐 [Demo ao Vivo](https://java-multiverse-explorer.vercel.app/)** | **📖 [API Docs](https://multiverse-explorer-api.onrender.com/swagger-ui.html)** | **🔌 [API Health](https://multiverse-explorer-api.onrender.com/api/multiverse/health)**

---

## 📸 Screenshots

### Seleção de Pokémon

![Pokémon Universe](screenshots/multiverse-pokemon.PNG)
_Interface moderna com grid de personagens e busca em tempo real_

### Seleção de Digimon

![Digimon Universe](screenshots/multiverse-digimon.PNG)
_Alternância fluida entre 58 universos com design cyberpunk azul_

### Comparação de Batalha

![Battle Comparison](screenshots/multiverse-result-comparation.PNG)
_Análise estatística visual com gráficos radar, ranking de poder e identificação do vencedor_

### Responsividade

![Responsive](screenshots/multiverse-responsive.PNG)
_Layout adaptável para desktop, tablet e mobile_

---

## 📋 Sobre o Projeto

Uma aplicação **full-stack moderna** que integra APIs públicas de 58 universos de anime em uma plataforma unificada para exploração e comparação de personagens. Compare Goku vs Naruto vs Luffy vs Pikachu em um único lugar!

### 🎯 Por que este projeto se destaca:

- 🌌 **58 Universos** - De Pokémon e Digimon aos tops do MyAnimeList
- 🎨 **Design Neo-Arcade Cyberpunk** - Interface futurista com tema azul/cyan
- ⚡ **Performance Otimizada** - Cache Guava com TTL de 30 minutos
- 📊 **Visualizações Interativas** - Gráficos Radar para comparação de stats
- 🔄 **Integração Multi-API** - PokeAPI + Digimon API + Jikan (MyAnimeList)
- 🎯 **Comparação Cross-Universe** - Compare até 8 personagens de universos diferentes!
- 🎮 **UX Gamificada** - Animações suaves com Framer Motion
- ♾️ **Scroll Infinito** - Carregamento paginado automático de personagens
- 🌐 **Deploy Profissional** - Frontend na Vercel + Backend no Render

---

## ✨ Funcionalidades

### 🎮 Universos Disponíveis (58 total)

#### APIs Próprias

| Universo    | Personagens | Features                                      |
| ----------- | ----------- | --------------------------------------------- |
| **Pokémon** | 1000+       | Stats reais (HP, ATK, DEF, SPD...), tipos     |
| **Digimon** | 250+        | Stats por level (Fresh→Ultra), determinístico |

#### Via Jikan API (MyAnimeList)

| Categoria       | Universos                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Shonen Clássico | Dragon Ball Z, Dragon Ball GT, Naruto, Naruto Shippuden, Bleach, Bleach TYBW, One Piece, Fairy Tail, Saint Seiya, Yu Yu Hakusho, Inuyasha                                                                                                                                                                                                                                                                                                              |
| Shonen Moderno  | Demon Slayer, My Hero Academia, Attack on Titan, Jujutsu Kaisen, Chainsaw Man, Black Clover, Hunter x Hunter, One Punch Man, Mob Psycho 100, Solo Leveling, Blue Lock, Dandadan                                                                                                                                                                                                                                                                        |
| Ação / Aventura | FMA Brotherhood, Death Note, Sword Art Online, Tokyo Ghoul, Berserk, Code Geass, Vinland Saga, Akame ga Kill, Seven Deadly Sins, Re:Zero, Overlord, Rising of Shield Hero, Hell's Paradise, Fire Force, Dororo, Parasyte, Steins;Gate, Neon Genesis Evangelion, Cowboy Bebop, Samurai Champloo, Fate/Zero, Psycho-Pass, JoJo's Bizarre Adventure, Promised Neverland, Dr. Stone, Mushoku Tensei, Tensura, Cyberpunk Edgerunners, Spy x Family, Frieren |
| Outros          | Haikyuu!!, SAO II                                                                                                                                                                                                                                                                                                                                                                                                                                      |

### 🔥 Features Principais

- ✅ **58 Universos** - Todos os top animes do MyAnimeList/IMDB
- ✅ **Comparação de até 8 personagens** - Cross-universe battle royale
- ✅ **Scroll Infinito** - Carregamento automático paginado
- ✅ **Busca em Tempo Real** - Filtre personagens instantaneamente
- ✅ **Sistema de Poder Inteligente** - favorites MAL + fallback por posição + role bonus
- ✅ **Ranking de Poder** - 🥇🥈🥉 com pontuação detalhada
- ✅ **Gráficos Radar** - Comparação visual de stats (1v1)
- ✅ **Cache Inteligente** - Respostas rápidas sem sobrecarregar APIs externas
- ✅ **Rate Limiting** - Respeita limites da Jikan API (350ms entre requests)
- ✅ **Interface Responsiva** - Desktop, tablet e mobile

### 🧮 Sistema de Poder

| Universo | Método                                               | Exemplo                     |
| -------- | ---------------------------------------------------- | --------------------------- |
| Pokémon  | Stats reais da PokeAPI (soma de HP+ATK+DEF+...)      | Mewtwo: 680 pts             |
| Digimon  | Base por level + variação determinística por índice  | Agumon (Rookie): ~40-59 pts |
| Jikan    | MAL favorites + role bonus (Main+500/Supporting+100) | Goku: ~85.500 pts           |

---

## 🚀 Tech Stack

### 🔴 Backend (API REST)

```
Java 17 + Spring Boot 3.2.2
├── Spring Web (REST Controllers)
├── Guava Cache (Cache em memória, TTL 30min)
├── RestTemplate (HTTP Client)
├── SpringDoc OpenAPI (Swagger)
├── Lombok (Boilerplate Reduction)
└── Jackson (JSON Processing)
```

**Deploy:** Render - [https://multiverse-explorer-api.onrender.com](https://multiverse-explorer-api.onrender.com)

### 🔵 Frontend (Web Interface)

```
React 18 + TypeScript 5.3
├── Vite 5.0 (Build Tool)
├── Tailwind CSS 3.4 (Styling)
├── Framer Motion 11.0 (Animations)
├── Recharts 2.10 (Radar Charts)
├── Axios 1.6 (HTTP Client)
└── React Icons 5.0 (UI Icons)
```

**Deploy:** Vercel - [https://java-multiverse-explorer.vercel.app](https://java-multiverse-explorer.vercel.app)

---

## 🏗️ Arquitetura

### Fluxo de Dados

```
┌─────────────────────────────────────────────────────┐
│   Frontend React (Vercel)                           │
│   ├── MultiverseExplorer Component                  │
│   ├── Universe Selector (58 universos)              │
│   ├── Character Grid + Scroll Infinito              │
│   ├── Comparação até 8 personagens                  │
│   └── Modal: Ranking + Radar Chart + Análise        │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS/REST
                       ▼
┌─────────────────────────────────────────────────────┐
│   Backend Spring Boot (Render)                      │
│   ├── MultiverseController (REST Endpoints)         │
│   ├── MultiverseService (Business Logic)            │
│   │   ├── calculatePower() - Sistema de poder       │
│   │   ├── compareCharacters() - Ranking 1-8        │
│   │   └── Rate Limiting (Jikan: 350ms delay)        │
│   └── Guava Cache (30min TTL, max 1000 entries)     │
└──────────┬──────────────────┬───────────────────────┘
           │                  │
    ┌──────┴──────┐    ┌──────┴──────────────┐
    ▼             ▼    ▼                     ▼
┌────────┐ ┌─────────┐ ┌───────────────────────────┐
│PokeAPI │ │Digimon  │ │  Jikan API (MyAnimeList)  │
│1000+   │ │API 250+ │ │  56 universos via anime ID │
│Pokémons│ │Digimons │ │  + Rate Limiting 3req/seg  │
└────────┘ └─────────┘ └───────────────────────────┘
```

### Estrutura de Dados

```java
// Model unificado para todos os universos
Character {
  id:       String              // Identificador único
  name:     String              // Nome do personagem
  imageUrl: String              // URL da imagem oficial
  type:     String              // Tipo/role (fire, Rookie, Main...)
  stats:    Map<String,String>  // stats numéricos para calculatePower()
}

// Resultado da comparação (2-8 personagens)
ComparisonResult {
  winner:   Character           // Personagem com maior totalPower
  analysis: String              // Texto descritivo do resultado
  ranking:  List<RankedCharacter> {
    id, name, imageUrl, type,
    totalPower: int,            // Soma dos stats numéricos
    position:   int             // 1º, 2º, 3º...
  }
}
```

---

## 🔧 Instalação Local

### Pré-requisitos

```bash
java --version    # Java 17+
node --version    # Node.js 18+
npm --version     # npm 9+
```

### Quick Start

#### 1️⃣ Clone o repositório

```bash
git clone https://github.com/DiegoRapichan/java-multiverse-explorer.git
cd java-multiverse-explorer
```

#### 2️⃣ Backend (Terminal 1)

```bash
cd backend

# Windows
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

✅ **Backend:** `http://localhost:8080`  
📚 **Swagger:** `http://localhost:8080/swagger-ui.html`

#### 3️⃣ Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

✅ **Frontend:** `http://localhost:5173`

> ⚠️ O Render hiberna serviços gratuitos após inatividade. A primeira requisição pode levar 30-60s para o backend "acordar".

---

## 📚 API Endpoints

### Base URL

```
Produção: https://multiverse-explorer-api.onrender.com/api/multiverse
Local:    http://localhost:8080/api/multiverse
```

### Endpoints

```http
# Listar todos os universos disponíveis
GET /universes

# Listar personagens com paginação (scroll infinito)
GET /{universe}/characters?limit=50&offset=0

# Buscar personagem por nome
GET /{universe}/characters/{name}

# Comparar 2 a 8 personagens
POST /compare
Body: { "characters": [ {...}, {...}, ... ] }

# Health check
GET /health
```

### Exemplo de Comparação

```bash
curl -X POST https://multiverse-explorer-api.onrender.com/api/multiverse/compare \
  -H "Content-Type: application/json" \
  -d '{
    "characters": [
      { "id": "149", "name": "dragonite", "imageUrl": "...", "type": "dragon", "stats": {"hp":"91","attack":"134"} },
      { "id": "6",   "name": "charizard",  "imageUrl": "...", "type": "fire",   "stats": {"hp":"78","attack":"84"} }
    ]
  }'
```

```json
{
  "winner": { "name": "dragonite", ... },
  "analysis": "dragonite vence com 600 pts. Ranking: 1º dragonite (600 pts), 2º charizard (534 pts).",
  "ranking": [
    { "name": "dragonite", "totalPower": 600, "position": 1 },
    { "name": "charizard",  "totalPower": 534, "position": 2 }
  ]
}
```

---

## 📁 Estrutura do Projeto

```
java-multiverse-explorer/
│
├── backend/
│   └── src/main/java/com/multiverse/
│       ├── controller/
│       │   └── MultiverseController.java    # GET /characters, POST /compare
│       ├── service/
│       │   └── MultiverseService.java       # Lógica + cache + poder
│       ├── model/
│       │   ├── Character.java               # Model unificado
│       │   ├── Universe.java                # 58 universos (enum)
│       │   └── ComparisonResult.java        # Resultado com ranking
│       └── config/                          # CORS, Swagger
│
└── frontend/src/
    ├── components/
    │   └── MultiverseExplorer.tsx           # Componente principal
    ├── services/
    │   └── api.ts                           # Axios client
    └── types/
        └── index.ts                         # Types + UNIVERSE_CONFIG (58 universos)
```

---

## 🚀 Deploy

### Backend - Render

**URL:** [https://multiverse-explorer-api.onrender.com](https://multiverse-explorer-api.onrender.com)

```yaml
# render.yaml
services:
  - type: web
    name: multiverse-explorer-api
    runtime: docker
    rootDir: backend
```

### Frontend - Vercel

**URL:** [https://java-multiverse-explorer.vercel.app](https://java-multiverse-explorer.vercel.app)

```
Framework: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist

Variável de ambiente:
VITE_API_URL=https://multiverse-explorer-api.onrender.com/api/multiverse
```

---

## 🎯 Roadmap

### ✅ Fase 1: MVP

- [x] Backend Spring Boot com cache Guava
- [x] Integração PokeAPI (stats reais)
- [x] Integração Digimon API (stats por level)
- [x] Frontend React + TypeScript + design cyberpunk azul
- [x] Comparação com gráficos Radar
- [x] Deploy Render + Vercel

### ✅ Fase 2: Expansão (Concluído)

- [x] 58 universos via Jikan API (MyAnimeList)
- [x] Comparação de até 8 personagens
- [x] Scroll infinito com paginação
- [x] Sistema de poder inteligente (favorites + posição + role)
- [x] Ranking 🥇🥈🥉 com pontuação
- [x] Rate limiting para Jikan API

### 🔮 Fase 3: Planejado

- [ ] Filtros por tipo/poder/universo
- [ ] Favoritos com localStorage
- [ ] Histórico de comparações
- [ ] PWA (Progressive Web App)
- [ ] Testes unitários (JUnit + React Testing Library)
- [ ] CI/CD com GitHub Actions

---

## 👨‍💻 Autor

<div align="center">

### **Diego Colombari Rapichan**

Desenvolvedor Full Stack — Java/Spring Boot + React/TypeScript

[![GitHub](https://img.shields.io/badge/GitHub-DiegoRapichan-181717?style=for-the-badge&logo=github)](https://github.com/DiegoRapichan)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Diego_Rapichan-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/diego-rapichan)
[![Email](https://img.shields.io/badge/Email-direrapichan@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:direrapichan@gmail.com)

📍 Apucarana, Paraná — Brasil

</div>

---

## 🙏 Agradecimentos

- **[PokeAPI](https://pokeapi.co/)** — Stats reais de 1000+ Pokémon
- **[Digimon API](https://digimon-api.vercel.app/)** — 250+ Digimons
- **[Jikan API](https://jikan.moe/)** — MyAnimeList não-oficial, 56 universos
- **[Spring Boot](https://spring.io/)** — Framework backend robusto
- **[React](https://react.dev/)** + **[Framer Motion](https://www.framer.com/motion/)** — UI fluida e animada
- **[Recharts](https://recharts.org/)** — Gráficos Radar interativos
- **[Render](https://render.com/)** + **[Vercel](https://vercel.com/)** — Deploy gratuito

---

<div align="center">

## ⭐ Se este projeto foi útil, deixa uma estrela!

**🌐 [Live Demo](https://java-multiverse-explorer.vercel.app/)** | **📖 [API Docs](https://multiverse-explorer-api.onrender.com/swagger-ui.html)**

[⬆ Voltar ao topo](#-multiverse-data-explorer)

</div>

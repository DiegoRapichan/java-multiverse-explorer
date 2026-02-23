# Multiverse Data Explorer

> Plataforma full stack de integração e comparação cross-API — unifica dados de 3 APIs públicas distintas (PokeAPI, Digimon API, Jikan/MyAnimeList) em um modelo de dados comum, implementa cache em memória com TTL, rate limiting por API e algoritmo de scoring cross-domain para comparação de entidades de universos diferentes.

![Java](https://img.shields.io/badge/Java_17-ED8B00?style=flat&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.2-6DB33F?style=flat&logo=springboot&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript_5.3-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=flat&logo=react&logoColor=black)
![Guava](https://img.shields.io/badge/Guava_Cache-4285F4?style=flat&logo=google&logoColor=white)

**[🚀 App ao Vivo](https://java-multiverse-explorer.vercel.app)** • **[📖 Swagger UI](https://multiverse-explorer-api.onrender.com/swagger-ui.html)** • **[🔌 API](https://multiverse-explorer-api.onrender.com/api/multiverse)**

---

## 🛠️ Stack

| Camada           | Tecnologias                                                                            |
| ---------------- | -------------------------------------------------------------------------------------- |
| **Backend**      | Java 17 · Spring Boot 3.2 · Spring Web · Guava Cache · RestTemplate · Lombok · Jackson |
| **Documentação** | SpringDoc OpenAPI / Swagger                                                            |
| **Frontend**     | React 18 · TypeScript 5.3 · Vite · Tailwind CSS · Recharts · Framer Motion · Axios     |
| **Deploy**       | Render (backend) · Vercel (frontend)                                                   |

---

## ⚙️ Destaques Técnicos

**Modelo de dados unificado para 3 APIs heterogêneas**
PokeAPI, Digimon API e Jikan retornam estruturas completamente diferentes. O `MultiverseService` normaliza tudo para um único modelo `Character` — `id`, `name`, `imageUrl`, `type` e `stats: Map<String, String>`. Essa abstração permite que o algoritmo de comparação opere de forma agnóstica à fonte, sem ramificações por universo na camada de negócio.

**Cache Guava com TTL de 30 minutos**
Respostas das 3 APIs são cacheadas em memória com Guava Cache (máximo 1.000 entradas, TTL 30min). APIs externas — especialmente PokeAPI com 1.000+ Pokémon — têm latência variável. O cache garante resposta rápida após a primeira requisição e evita sobrecarga nas APIs de origem.

**Rate limiting explícito para Jikan API**
Jikan (wrapper não-oficial do MyAnimeList) impõe limite de 3 req/s. O serviço aplica delay de 350ms entre chamadas — simples e eficaz para respeitar o contrato da API sem biblioteca externa de throttling.

**Algoritmo de scoring cross-domain**
O desafio central: como comparar Pokémon (stats numéricos reais), Digimons (base por level com variação determinística) e personagens de anime (sem stats reais)? Três métodos distintos em `calculatePower()`, cada um calibrado para a natureza dos dados disponíveis por API.

**Paginação server-side com scroll infinito**
O endpoint `/{universe}/characters?limit=50&offset=0` suporta paginação. O frontend consome com scroll infinito — carrega o próximo lote automaticamente ao atingir o fim da lista.

**TypeScript end-to-end no frontend**
Types explícitos para `Character`, `Universe` e `ComparisonResult`. `UNIVERSE_CONFIG` centraliza os 58 universos com IDs Jikan e metadados — adicionar um novo universo é uma linha no config, sem tocar em lógica de negócio.

---

## 🧮 Algoritmo de Scoring Cross-Domain

O problema central do projeto: entidades de APIs diferentes têm dados incomparáveis por natureza. A solução é um `calculatePower()` com três estratégias distintas:

```
calculatePower(character, universe):

  POKEMON:
    retorna soma de todos os valores numéricos em character.stats
    // HP + ATK + DEF + SP_ATK + SP_DEF + SPD — stats reais da PokeAPI
    // Ex: Mewtwo → 680 pts

  DIGIMON:
    base = tabelaBaseLevel[character.level]
    // Fresh=10, In-Training=20, Rookie=40, Champion=80, Ultimate=120, Mega=160, Ultra=200
    retorna base + (character.index % 20)
    // Variação determinística — mesma entrada sempre produz mesmo resultado
    // Ex: Agumon (Rookie, index=5) → 45 pts

  JIKAN (anime via MyAnimeList):
    score = character.malFavorites      // popularidade real no MAL
    se role == "Main":        score += 500
    se role == "Supporting":  score += 100
    retorna score
    // Aproximação por popularidade quando não existem stats reais
    // Ex: Goku → ~85.500 pts
```

**Comparação cross-universe (`POST /compare`):**
Aceita 2 a 8 personagens de qualquer combinação de universos. Cada um passa por `calculatePower()` com sua lógica específica. O resultado inclui ranking ordenado, identificação do vencedor e texto descritivo — calculado inteiramente no backend.

---

## 🌐 Integração com APIs Externas

| API             | Cobertura                    | Dados utilizados                                                  |
| --------------- | ---------------------------- | ----------------------------------------------------------------- |
| **PokeAPI**     | 1.000+ Pokémon               | Stats reais (HP, ATK, DEF, SP_ATK, SP_DEF, SPD), tipos, imagens   |
| **Digimon API** | 250+ Digimons                | Nome, level (Fresh → Ultra), imagem                               |
| **Jikan API**   | 56 universos via MyAnimeList | Personagens por anime ID, favorites count, role (Main/Supporting) |

Os 58 universos abrangem Dragon Ball, Naruto, One Piece, Attack on Titan, Demon Slayer, Jujutsu Kaisen, entre outros — todos mapeados no `UNIVERSE_CONFIG` do frontend com seus respectivos IDs Jikan.

---

## 🔌 Endpoints da API

```
Base URL: https://multiverse-explorer-api.onrender.com/api/multiverse

GET  /universes                           Lista os 58 universos disponíveis
GET  /{universe}/characters?limit&offset  Personagens com paginação (scroll infinito)
GET  /{universe}/characters/{name}        Busca personagem por nome
POST /compare                             Compara 2 a 8 personagens cross-universe
GET  /health                              Health check
```

**Exemplo — comparação cross-universe:**

```bash
curl -X POST .../api/multiverse/compare \
  -H "Content-Type: application/json" \
  -d '{
    "characters": [
      { "id": "149", "name": "dragonite", "type": "dragon",
        "stats": {"hp":"91","attack":"134","defense":"95","speed":"80"} },
      { "id": "6", "name": "charizard", "type": "fire",
        "stats": {"hp":"78","attack":"84","defense":"78","speed":"100"} }
    ]
  }'
```

```json
{
  "winner": { "name": "dragonite" },
  "ranking": [
    { "name": "dragonite", "totalPower": 600, "position": 1 },
    { "name": "charizard", "totalPower": 534, "position": 2 }
  ],
  "analysis": "dragonite vence com 600 pts."
}
```

Documentação interativa completa: **[Swagger UI](https://multiverse-explorer-api.onrender.com/swagger-ui.html)**

---

## 📁 Estrutura do Projeto

```
java-multiverse-explorer/
├── backend/src/main/java/com/multiverse/
│   ├── controller/
│   │   └── MultiverseController.java    # Endpoints REST
│   ├── service/
│   │   └── MultiverseService.java       # Integração APIs + Guava Cache + calculatePower()
│   ├── model/
│   │   ├── Character.java               # Modelo unificado cross-API
│   │   ├── Universe.java                # Enum com 58 universos
│   │   └── ComparisonResult.java        # Resultado com ranking
│   └── config/                          # CORS, Swagger, Guava Cache config
│
└── frontend/src/
    ├── components/
    │   └── MultiverseExplorer.tsx        # Grid + comparação + gráfico Radar
    ├── services/
    │   └── api.ts                        # Axios client
    └── types/
        └── index.ts                      # Types + UNIVERSE_CONFIG (58 universos)
```

---

## 📸 Screenshots

**Seleção de universo e grid de personagens**
![Universe Selection](docs/screenshots/dashboard.png)

**Comparação cross-universe com gráfico Radar**
![Battle Comparison](docs/screenshots/adding-materials.png)

**Interface responsiva**
![Responsive](docs/screenshots/raw-materials.png)

---

## 🚀 Como Rodar Localmente

**Pré-requisitos:** Java 17+, Node.js 18+, Maven

```bash
# 1. Clone
git clone https://github.com/DiegoRapichan/java-multiverse-explorer.git
cd java-multiverse-explorer

# 2. Backend
cd backend
./mvnw spring-boot:run
# API em http://localhost:8080
# Swagger em http://localhost:8080/swagger-ui.html

# 3. Frontend (novo terminal)
cd frontend
npm install
# Configure .env:
# VITE_API_URL=http://localhost:8080/api/multiverse
npm run dev
# App em http://localhost:5173
```

> ⚠️ O Render hiberna serviços gratuitos após inatividade. A primeira requisição pode levar 30–60s para o backend "acordar".

---

## 🌐 Deploy

| Serviço     | URL                                                          |
| ----------- | ------------------------------------------------------------ |
| Frontend    | https://java-multiverse-explorer.vercel.app                  |
| Backend API | https://multiverse-explorer-api.onrender.com                 |
| Swagger UI  | https://multiverse-explorer-api.onrender.com/swagger-ui.html |

---

## 👨‍💻 Autor

**Diego Rapichan** — Desenvolvedor Full Stack · Java/Spring Boot + Node.js + React

[![LinkedIn](https://img.shields.io/badge/LinkedIn-diego--rapichan-0077B5?style=flat&logo=linkedin)](https://linkedin.com/in/diego-rapichan)
[![GitHub](https://img.shields.io/badge/GitHub-DiegoRapichan-181717?style=flat&logo=github)](https://github.com/DiegoRapichan)

📍 Apucarana, Paraná — Brasil

---

📄 Licença MIT

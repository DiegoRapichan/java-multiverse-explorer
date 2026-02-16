# 🚀 QUICK START - Multiverse Data Explorer

## ⚡ Começar em 5 Minutos!

### Pré-requisitos
- ✅ Java 17+ ([Download](https://adoptium.net/))
- ✅ Node.js 18+ ([Download](https://nodejs.org/))

---

## 📦 Instalação

### 1. Extrair/Clonar
```bash
tar -xzf multiverse-explorer.tar.gz
cd multiverse-explorer
```

### 2. Backend (Terminal 1)
```bash
cd backend
./mvnw clean install -DskipTests
./mvnw spring-boot:run
```

✅ **Backend:** http://localhost:8080  
📚 **Swagger:** http://localhost:8080/swagger-ui.html

### 3. Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

✅ **Frontend:** http://localhost:3000

---

## 🎮 Como Usar

### 1. Escolher Universo
- Clique em **🎮 Pokémon** ou **👾 Digimon**

### 2. Explorar Personagens
- Veja todos os personagens em cards bonitos
- Use a busca para filtrar

### 3. Comparar
- Clique em 2 personagens
- Clique em **"Comparar Selecionados"**
- Veja gráfico radar e vencedor!

---

## 🔥 Features

- **🔍 Busca:** Digite o nome do personagem
- **📊 Stats:** Veja stats em tempo real
- **⚔️ Comparação:** Gráficos radar épicos
- **🎨 Tipos:** Cores diferentes para cada tipo
- **🏆 Vencedor:** Algoritmo identifica o mais forte

---

## 🐛 Problemas Comuns

### Backend não inicia
```bash
java -version  # Deve ser 17+
cd backend
./mvnw clean install -U
```

### Frontend não inicia
```bash
node -v  # Deve ser 18+
cd frontend
rm -rf node_modules
npm install
```

### Erro de CORS
- Backend: porta 8080
- Frontend: porta 3000

---

## 📚 Próximos Passos

1. Teste a comparação Pikachu vs Agumon
2. Explore o Swagger UI
3. Veja o código fonte
4. Adicione novos universos!

---

**Desenvolvido com ❤️ por Diego Rapichan**

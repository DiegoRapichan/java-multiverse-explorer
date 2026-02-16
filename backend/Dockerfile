# Build stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copiar pom.xml e baixar dependências
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiar código fonte e buildar
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiar JAR do build stage
COPY --from=build /app/target/*.jar app.jar

# Expor porta
EXPOSE 8080

# Variável de ambiente para porta
ENV PORT=8080

# Comando de inicialização
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
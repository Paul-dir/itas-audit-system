# Multi-stage build for Spring Boot 3.2 (Java 21) from repo root
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /build

# Cache maven dependencies
COPY backend/bs-taxaudit-core-server/pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY backend/bs-taxaudit-core-server/src ./src
RUN mvn clean package -DskipTests -P \!allow-http-repos

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy artifact from builder
COPY --from=builder /build/target/bs-taxaudit-core-server-1.0.0-SNAPSHOT.jar app.jar

ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=mock
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Xss512k -XX:+ExitOnOutOfMemoryError"

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar --server.port=${PORT}"]

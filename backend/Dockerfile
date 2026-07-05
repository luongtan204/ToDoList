# backend/Dockerfile

# --- Stage 1: Build file .jar bằng Maven ---
FROM maven:3.9.4-eclipse-temurin-17-alpine AS builder
WORKDIR /app
# Copy file cấu hình maven và source code
COPY pom.xml .
COPY src ./src
# Build project, bỏ qua test để tăng tốc độ build
RUN mvn clean package -DskipTests

# --- Stage 2: Chạy ứng dụng với JRE siêu nhẹ ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Lấy file .jar đã build từ Stage 1 sang
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

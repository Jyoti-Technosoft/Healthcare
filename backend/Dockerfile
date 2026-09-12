# Stage 1: Build the Spring Boot application using Maven
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy pom.xml and download dependencies (cache layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and package the JAR (skipping tests for speed)
COPY src ./src
RUN mvn package -DskipTests -B

# Stage 2: Create lightweight runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port (Render sets PORT env variable dynamically)
EXPOSE 8082

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]

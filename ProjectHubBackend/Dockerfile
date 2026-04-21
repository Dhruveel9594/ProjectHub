# ─────────────────────────────────────────────────────────────
# Stage 1: BUILD
# Uses Maven to compile and package the JAR
# This stage is discarded after build — keeps final image small
# ─────────────────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy pom.xml first — Docker caches this layer
# So dependencies are only re-downloaded if pom.xml changes
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy all source files
COPY src ./src

# Build the JAR — skip tests for faster build
# Output: target/ProjectHub-0.0.1-SNAPSHOT.jar
RUN mvn clean package -DskipTests -B

# ─────────────────────────────────────────────────────────────
# Stage 2: RUN
# Minimal Java image — only the JRE, no Maven, no source code
# ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy only the built JAR from the builder stage
COPY --from=builder /app/target/ProjectHub-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your Spring Boot runs on
# Your app uses 8090 based on your axios config
EXPOSE 8090

# Run the JAR
# -Djava.security.egd speeds up startup on containers
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
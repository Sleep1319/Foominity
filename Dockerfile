FROM openjdk:17-jdk-slim
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ARG JAR_FILE=build/libs/*.jar

COPY ${JAR_FILE} /app/app.jar

EXPOSE 8084
ENTRYPOINT ["java","-jar","/app/app.jar"]
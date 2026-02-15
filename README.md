# Kalendas - Full Stack Calendar (Docker Deployment)

Kalendas is a full-stack calendar application inspired by Google
Calendar, built with React (Frontend) and FastAPI + MongoDB (Backend).

The system runs entirely using Docker and Docker Compose, following a
microservices architecture with an API Gateway as the single entry
point.

------------------------------------------------------------------------

## ⚙️ Requirements

-   Docker
-   Docker Compose (included in Docker Desktop)

------------------------------------------------------------------------

## 🏗️ Project Architecture

Kalendas is composed of:

-   Frontend (React)
-   API Gateway (FastAPI)
-   Microservices:
    -   Calendars
    -   Events
    -   Comments
    -   Tags
    -   Notifications
    -   Users
    -   Email & Multimedia service
-   MongoDB database

All services communicate internally within the Docker network.

------------------------------------------------------------------------

## 🚀 Run the Application

1️⃣ Clone the repository:

``` bash
git clone https://github.com/yourusername/Kalendas.git
cd Kalendas
```

2️⃣ Build and start all containers:

``` bash
docker compose up --build
```

This will automatically start:

-   MongoDB
-   All FastAPI microservices
-   API Gateway
-   React Frontend

------------------------------------------------------------------------

## 🌐 Access

Frontend: http://localhost:3000

API Gateway: http://localhost:8001

MongoDB (external port): localhost:27018

------------------------------------------------------------------------

## 🗄️ Database Initialization

MongoDB initializes automatically using scripts located in:

Backend/mongo_init

------------------------------------------------------------------------

## 🧠 Project Purpose

Kalendas was built to demonstrate:

-   Microservices architecture
-   API Gateway pattern
-   Service-to-service communication
-   MongoDB persistence
-   Frontend/Backend separation
-   Full containerized deployment using Docker

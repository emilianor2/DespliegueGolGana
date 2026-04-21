# ⚽ GolGana – Sports Booking Platform (Kubernetes Deployment)

> Full stack application deployed on Kubernetes demonstrating backend and DevOps skills.

---

## 📌 Description

GolGana is a web platform for managing and booking sports fields.

This project was developed as an academic project and demonstrates the full development lifecycle:
👉 backend + frontend + containers + Kubernetes deployment.

---

## 🚀 What this project demonstrates

* ✔️ Full stack development (Node.js + React)
* ✔️ Containerization with Docker
* ✔️ Deployment with Kubernetes (Minikube)
* ✔️ Environment automation with scripts
* ✔️ Database integration

---

## 🛠️ Technologies

* Node.js + Express
* React
* MySQL
* Docker
* Kubernetes (Minikube)

---

## ⚙️ Architecture

* Backend API REST (Node.js)
* Frontend SPA (React)
* MySQL database
* Docker containers
* Kubernetes orchestration

---

## 🚀 Automated deployment

The script `setup_minikube.sh`:

* Installs required tools (Docker, kubectl, Minikube)
* Builds Docker images
* Pushes them to Docker Hub
* Deploys the application to Kubernetes

---

## ▶️ Quick Start

```bash id="gk01"
./setup_minikube.sh
```

Access the app:

```bash id="gk02"
minikube service frontend-service -n dev
```

---

## ⚙️ Environment variables

### Backend

```env id="gk03"
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=golgana
PORT=5000
JWT_SECRET=<secret>
OPEN_CAGE_API_KEY=<key>
```

### Frontend

```env id="gk04"
VITE_OPENCAGE_API_KEY=<key>
```

---

## 🧪 Local execution

```bash id="gk05"
cd appdemo
npm install
npm start
```

---

## 📦 Requirements

* Node.js 18+
* Docker
* Minikube
* MySQL

---

# 🇪🇸 Versión en español

## 📌 Descripción

GolGana es una plataforma web para la gestión y reserva de canchas deportivas.

Este proyecto demuestra el ciclo completo de desarrollo:
backend + frontend + contenedores + despliegue en Kubernetes.

---

## 🚀 Qué demuestra este proyecto

* Desarrollo full stack
* Uso de Docker
* Deploy en Kubernetes
* Automatización de entorno
* Integración con base de datos

---

## 👨‍💻 Autor

Emiliano Rodríguez

# GolGana Minikube Deployment

This repository contains a demo application with a Node.js backend and a React frontend. `setup_minikube.sh` can be used to install the required tools, build the Docker images, push them to Docker Hub and deploy everything on a local Minikube cluster.

## Quick start

```bash
./setup_minikube.sh
```

The script expects Docker Hub credentials. You can optionally export `DOCKER_USER` and `DOCKER_PASSWORD` environment variables before running it. By default, the Docker Hub username `emilianor` is used.

## Prerequisites

- **Node.js** 18 or later and **npm** for running the application locally.
- **Docker**, **kubectl** and **Minikube** for the deployment script.
- A running **MySQL** instance when starting the application outside of Minikube.

`setup_minikube.sh` will install Docker, kubectl and Minikube automatically if they are not already present on the system.

## Environment variables

The backend and frontend rely on several environment variables. Sample `.env` files exist in `appdemo/backend` and `appdemo/frontend`.

### Backend

```
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

```
VITE_OPENCAGE_API_KEY=<key>
```

### Docker Hub

The deployment script uses the following variables to push images:

```
DOCKER_USER=<docker hub username>
DOCKER_PASSWORD=<docker hub password>
```

## Running with Minikube

1. Export your Docker Hub credentials (optional if you want to enter them interactively):
   ```bash
   export DOCKER_USER=myuser
   export DOCKER_PASSWORD=mypassword
   ```
2. Execute the setup script:
   ```bash
   ./setup_minikube.sh
   ```
   It builds the Docker images, pushes them to Docker Hub and deploys all Kubernetes manifests on a local Minikube cluster.
3. When the pods are ready you can access the frontend with:
   ```bash
   minikube service frontend-service -n dev
   ```

## Running locally

To run the Node.js API and the React client without Docker or Minikube:

1. Ensure a MySQL server is running with the credentials configured in `appdemo/backend/.env`.
2. Install dependencies:
   ```bash
   cd appdemo
   npm install
   ```
3. Start both servers:
   ```bash
   npm start
   ```
   The backend will listen on the port defined in `.env` (defaults to `5000`) and the frontend on port `5173`.

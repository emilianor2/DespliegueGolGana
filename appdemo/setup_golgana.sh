#!/bin/bash

set -e

echo "🔍 Verificando e instalando dependencias necesarias..."

# Instalar Docker si no está
if ! command -v docker &> /dev/null; then
  echo "🐳 Instalando Docker..."
  sudo apt update
  sudo apt install -y docker.io
  sudo systemctl enable --now docker
  sudo usermod -aG docker $USER
else
  echo "✅ Docker ya está instalado"
fi

# Instalar kubectl si no está
if ! command -v kubectl &> /dev/null; then
  echo "📦 Instalando kubectl..."
  curl -LO "https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
  chmod +x kubectl
  sudo mv kubectl /usr/local/bin/
else
  echo "✅ kubectl ya está instalado"
fi

# Instalar Minikube si no está
if ! command -v minikube &> /dev/null; then
  echo "📦 Instalando Minikube..."
  curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
  sudo install minikube-linux-amd64 /usr/local/bin/minikube
  rm minikube-linux-amd64
else
  echo "✅ Minikube ya está instalado"
fi

echo "🚀 Iniciando Minikube..."
minikube start --driver=docker

echo "🔧 Activando entorno Docker de Minikube..."
eval $(minikube docker-env)

echo "📦 Construyendo imagen del backend..."
docker build -t golgana-backend:v1 ./backend

echo "📦 Construyendo imagen del frontend..."
docker build -t frontend-react:latest ./frontend

echo "📁 Aplicando manifiestos de Kubernetes..."
kubectl apply -f k8s-manifests/namespacedev.yaml
kubectl apply -f k8s-manifests/pv.yaml
kubectl apply -f k8s-manifests/pvc.yaml
kubectl apply -f k8s-manifests/secret-db.yaml
kubectl apply -f k8s-manifests/configmap-db.yaml
kubectl apply -f k8s-manifests/deployment-db.yaml
kubectl apply -f k8s-manifests/service-db.yaml
kubectl apply -f k8s-manifests/backend-deployment.yaml
kubectl apply -f k8s-manifests/backend-service.yaml
kubectl apply -f k8s-manifests/frontend-deployment.yaml
kubectl apply -f k8s-manifests/frontend-service.yaml
kubectl apply -f k8s-manifests/ingress.yaml

echo "🧩 Habilitando Ingress..."
minikube addons enable ingress

echo "⏳ Esperando que los pods estén listos..."
kubectl wait --for=condition=available deployment/frontend-deployment -n golgana-dev --timeout=120s
kubectl wait --for=condition=available deployment/backend -n golgana-dev --timeout=120s
kubectl wait --for=condition=available deployment/mysql -n golgana-dev --timeout=120s

# Agregar entrada a /etc/hosts
IP=$(minikube ip)
LINE="$IP frontend.local"
if ! grep -q "$LINE" /etc/hosts; then
  echo "📌 Agregando $LINE a /etc/hosts..."
  echo "$LINE" | sudo tee -a /etc/hosts
else
  echo "✅ La entrada $LINE ya existe en /etc/hosts"
fi

echo "🎉 Todo listo. Accedé a: http://frontend.local"

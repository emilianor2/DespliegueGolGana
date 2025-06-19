# Dockerfile - React + Vite
# Etapa de build
FROM node:18 AS build

WORKDIR /app

# Copiar e instalar dependencias
COPY package*.json ./
RUN npm install --legacy-peer-deps
RUN npm install -g vite

# Copiar el resto del código
COPY . .

ENV NODE_ENV=production

# Construir la app (Vite genera /dist)
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]



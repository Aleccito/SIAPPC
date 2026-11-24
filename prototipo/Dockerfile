# Prototipo del módulo médico (pantallas de Figma). Los datos vienen del backend (/api) o del simulador según
# VITE_API_MODE, que Vite fija al compilar (CONEXION-BACKEND.md, secciones 1 y 9).
# Stage 1: build the static bundle.
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# mock = todo simulado; real = todo al backend; mixto = solo los grupos o rutas de VITE_API_REAL van al backend.
ARG VITE_API_MODE=mock
ARG VITE_API_REAL=
ENV VITE_API_MODE=$VITE_API_MODE
ENV VITE_API_REAL=$VITE_API_REAL
RUN npm run build

# Stage 2: runtime. Only the built assets survive; node_modules stays behind.
FROM nginx:1.29-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

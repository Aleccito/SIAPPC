# SIMULADO: publicador de demo (ver LEEME.md). No es un servicio del Compose: se corre aparte con `docker run`
# en la red `siappc_default`, solo donde se quiera ver el prototipo vivo sin equipos de verdad.
FROM node:24-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY publicador.mjs casos.json ./
USER node
CMD ["node", "publicador.mjs"]

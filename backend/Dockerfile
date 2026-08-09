# Stage 1: resolve production dependencies only.
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Stage 2: runtime. Node runs the TypeScript sources directly (type stripping),
# so there is no build output to copy.
FROM node:24-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY db ./db
USER node
EXPOSE 3001
CMD ["node", "src/server.ts"]

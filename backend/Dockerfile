# Stage 1: resolve production dependencies only.
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# --ignore-scripts: every runtime dependency here is plain JavaScript, nothing
# compiles on install. Running install hooks would buy nothing and hand
# arbitrary code execution to any package in the tree.
RUN npm ci --omit=dev --ignore-scripts

# Stage 2: generate the Prisma client. Needs the dev dependencies (the `prisma`
# CLI) and the schema, and produces src/generated/, which is the only thing that
# crosses into the runtime image. The client itself (@prisma/client) and the
# driver (@prisma/adapter-mariadb) are runtime dependencies and come from `deps`.
FROM node:24-alpine AS prisma
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY prisma ./prisma
COPY prisma.config.ts ./
# `generate` does not touch the database: it only reads the schema. The URL in
# prisma.config.ts is built from DB_* variables that are absent here, and that
# is fine — nothing connects.
RUN node node_modules/prisma/build/index.js generate

# Stage 3: runtime. Node runs the TypeScript sources directly (type stripping),
# so there is no build output to copy.
FROM node:24-alpine AS runtime
ENV NODE_ENV=production
# The base image ships npm and yarn; this container invokes neither. It starts
# with `node src/server.ts`. Migrations do NOT run here: the Prisma CLI is a dev
# dependency and is not in this image. They run from the host, against the
# published database port —`cd backend && npm run migrate`— which is the same
# place `npm run db:up` and the rest of the database scripts already run from.
#
# This does NOT shrink the image: layers are additive, so the files still ship
# inside the base layer and all this adds is a whiteout. The point is reach — a
# process that gets in cannot `npm install` anything. Placed before the app is
# copied so the layer stays cached across code changes.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx \
           /opt/yarn-v* /usr/local/bin/yarn /usr/local/bin/yarnpkg
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY db ./db
# The ETL runs from this same image with a different command; see the `etl`
# service in docker-compose.yml and backend/etl/README.md.
COPY etl ./etl
# After `src`, so it is not shadowed by the copy above.
COPY --from=prisma /app/src/generated ./src/generated
USER node
EXPOSE 3001
CMD ["node", "src/server.ts"]

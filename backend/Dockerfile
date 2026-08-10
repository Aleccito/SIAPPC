# Stage 1: resolve production dependencies only.
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# --ignore-scripts: every runtime dependency here is plain JavaScript, nothing
# compiles on install. Running install hooks would buy nothing and hand
# arbitrary code execution to any package in the tree.
RUN npm ci --omit=dev --ignore-scripts

# Stage 2: runtime. Node runs the TypeScript sources directly (type stripping),
# so there is no build output to copy.
FROM node:24-alpine AS runtime
ENV NODE_ENV=production
# The base image ships npm and yarn; this container invokes neither. It starts
# with `node src/server.ts` and migrations run with `node db/migrate.ts`.
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
USER node
EXPOSE 3001
CMD ["node", "src/server.ts"]

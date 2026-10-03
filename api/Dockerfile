# Portfolio API — NestJS + Prisma (SQLite).
FROM node:20-alpine

# Prisma needs openssl at runtime on alpine.
RUN apk add --no-cache openssl

WORKDIR /app

# Install all deps (dev deps are needed to build and to run the ts-node seed).
COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate && npm run build

ENV NODE_ENV=production
ENV PORT=4000
# SQLite lives on a mounted volume (see docker-compose) so data survives
# rebuilds; kept outside /app so the code mount never shadows it.
ENV DATABASE_URL=file:/data/dev.db

EXPOSE 4000

# On boot: sync schema, run the idempotent (upsert) seed, then start.
CMD ["sh", "-c", "mkdir -p /data && npx prisma db push --skip-generate && npm run db:seed && node dist/main.js"]

# backend/Dockerfile

# ========================================
# STAGE 1 : Builder
# ========================================
FROM node:22-alpine AS builder

# Installer OpenSSL pour Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copier package files
COPY package*.json ./
COPY prisma ./prisma/

# Installer toutes les dépendances (dev inclus pour le build)
RUN npm ci

# Copier le code source
COPY . .

# Générer Prisma Client
RUN npx prisma generate

# Build l'application
RUN npm run build

# ========================================
# STAGE 2 : Production
# ========================================
FROM node:22-alpine AS production

# Installer OpenSSL pour Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copier package files
COPY package*.json ./
COPY prisma ./prisma/

# Installer SEULEMENT les dépendances de production
RUN npm ci --omit=dev

# Générer Prisma Client en prod aussi
RUN npx prisma generate

# Copier le build depuis le stage builder
COPY --from=builder /app/build ./build

# Exposer le port
EXPOSE 8080

# Commande de démarrage
CMD ["sh", "-c", "npx prisma migrate deploy && node build/main"]
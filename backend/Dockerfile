# backend/Dockerfile
FROM node:22-alpine

# Installer OpenSSL pour Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copier tout
COPY . .

# Installer les dépendances
RUN npm ci

# Générer Prisma Client
RUN npx prisma generate

# Build l'application
RUN npm run build

# Exposer le port
EXPOSE 8080

# Commande de démarrage
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
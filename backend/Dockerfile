# backend/Dockerfile
FROM node:22-alpine

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY . .

RUN npm ci

RUN npx prisma generate

# BUILD avec output verbeux
RUN echo "========== AVANT BUILD ==========" && \
    ls -la && \
    npm run build && \
    echo "========== APRÈS BUILD ==========" && \
    ls -la && \
    echo "========== CONTENU DIST ==========" && \
    ls -la dist/ || echo "PAS DE DIST" && \
    echo "========== CONTENU SRC ==========" && \
    ls -la src/

EXPOSE 8080

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
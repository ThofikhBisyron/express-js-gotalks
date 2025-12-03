FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# ===== STAGE FINAL (DISTROLESS) =====
FROM gcr.io/distroless/nodejs18

WORKDIR /app

COPY --from=builder /app .

EXPOSE 3000

CMD ["server.js"]

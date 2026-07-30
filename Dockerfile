FROM node:20-alpine AS builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./prisma

EXPOSE 5000

CMD ["node", "dist/server.js"]

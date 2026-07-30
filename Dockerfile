FROM node:20-alpine AS builder

WORKDIR /app/backend

COPY backend/package*.json ./
COPY backend/prisma ./prisma
RUN npm ci
RUN npx prisma generate

COPY backend/ ./
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app/backend

COPY backend/package*.json ./
COPY backend/prisma ./prisma
RUN npm ci --only=production
RUN npx prisma generate

COPY --from=builder /app/backend/dist ./dist

EXPOSE 5000

CMD ["node", "dist/server.js"]

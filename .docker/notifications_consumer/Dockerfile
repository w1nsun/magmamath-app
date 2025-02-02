# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY . .
RUN rm -rf assets .vscode .git node_modules .env

RUN npm install
# RUN npm install @nestjs/cli
# RUN npm list @nestjs/cli || true
# RUN which nest || true
RUN npm run build:notifications-consumer

# Final stage
FROM node:22-alpine

WORKDIR /app

# COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

USER node

CMD ["node", "dist/apps/notifications-consumer/main.js"]
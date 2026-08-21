# Base image
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Generate Prisma client and build
COPY . .
RUN npx prisma generate
RUN npm run build

# Production image
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/seed.js ./seed.js

EXPOSE 3000
CMD ["npm", "run", "start:prod"]

# ProtectedVault backend – for Render (Docker) or any container host
FROM node:20-alpine

WORKDIR /app

# Install backend deps
COPY backend/package.json backend/package-lock.json backend/tsconfig.json ./
RUN npm ci

# Copy source and build
COPY backend/src ./src
RUN npm run build

EXPOSE 3001

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]

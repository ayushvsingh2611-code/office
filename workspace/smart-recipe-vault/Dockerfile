# syntax=docker/dockerfile:1.4

# ---------- Builder stage ----------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source files and build the app
COPY . .
RUN npm run build   # Assumes the build output is placed in ./dist

# ---------- Runtime stage ----------
FROM nginx:alpine

# Copy the built static assets to Nginx's web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Use the default non‑root nginx user (already set in the base image)
STOPSIGNAL SIGTERM
CMD ["nginx", "-g", "daemon off;"]
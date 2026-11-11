# syntax=docker/dockerfile:1

# ---------- Stage 1: Build the frontend ----------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies (package.json and lock file)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Build production assets (adjust if your build script differs)
RUN npm run build

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:stable-alpine AS runtime

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Optional: copy a custom Nginx config (create nginx.conf alongside this Dockerfile)
# COPY nginx.conf /etc/nginx/conf.d/

# Copy built static files from the builder stage
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Expose HTTP port
EXPOSE 80

# Basic healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
  CMD wget -qO- http://localhost/ || exit 1

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
# syntax=docker/dockerfile:1

## ---------- Build Stage ----------
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code and build
COPY . .
RUN npm run build   # Assumes the build output is placed in ./build (e.g., React, Vue, etc.)

## ---------- Production Stage ----------
FROM nginx:alpine

# Remove default static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# (Optional) If you have a custom nginx config, uncomment the line below
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Nginx runs as the non‑root `nginx` user by default
CMD ["nginx", "-g", "daemon off;"]
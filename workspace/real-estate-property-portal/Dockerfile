# -------------------------
# Build stage
# -------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies (only package.json and lock file for caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code and build
COPY . .
RUN npm run build   # Assumes "build" script outputs static files to ./dist

# -------------------------
# Production stage (Nginx)
# -------------------------
FROM nginx:stable-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Optional: custom nginx configuration (uncomment if you have nginx.conf)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
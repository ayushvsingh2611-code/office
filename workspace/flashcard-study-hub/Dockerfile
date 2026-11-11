# ---------- Builder Stage ----------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install only production dependencies (skip dev deps)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source files and build the app
COPY . .
RUN npm run build   # Assumes this creates a ./dist (or ./build) folder with static assets

# ---------- Production Stage ----------
FROM nginx:alpine

# Use a non‑root user for better security
RUN adduser -D -g '' nginxuser && \
    chown -R nginxuser:nginx /var/cache/nginx /var/run

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files from builder
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Expose HTTP port
EXPOSE 80

# Run nginx as the non‑root user
USER nginxuser

# Default command (provided by the base image)
CMD ["nginx", "-g", "daemon off;"]
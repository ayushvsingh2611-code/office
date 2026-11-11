# ------------------------------------------------------------
# Stage 1 – Build the frontend assets
# ------------------------------------------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install only production dependencies first (caches layer)
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy the rest of the source code
COPY . .

# Build the static files (adjust the script name if different)
RUN npm run build

# ------------------------------------------------------------
# Stage 2 – Serve with Nginx
# ------------------------------------------------------------
FROM nginx:stable-alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Optional: copy a custom nginx configuration (if you have one)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Healthcheck to ensure Nginx is serving
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost/ || exit 1

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
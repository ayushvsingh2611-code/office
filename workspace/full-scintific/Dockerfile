# ==========================================
# STAGE 1: Build Environment
# ==========================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies & cached layer setup
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

# Copy source code and build
COPY . .

# Pass build-time environment variables if needed
ARG VITE_APP_TITLE="Scientific Calculator"
ENV VITE_APP_TITLE=$VITE_APP_TITLE

# Build production bundle
RUN npm run build

# ==========================================
# STAGE 2: Production Nginx Server
# ==========================================
FROM nginx:1.25-alpine AS runner

# Labeling for image management
LABEL maintainer="Sanji <devops@sanji.local>"
LABEL description="Production deployment for Scientific Calculator App"

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Permissions and security configuration (Non-root user setup support)
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /usr/share/nginx/html

# Switch to non-root user for security compliance
USER nginx

# Expose port
EXPOSE 8080

# Health check to monitor container status
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
# ---------- Build Stage ----------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies (only package.json and lock files for caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code and build the app
COPY . .
RUN npm run build   # Assumes the build output is placed in ./dist or ./build

# ---------- Production Stage ----------
FROM nginx:1.27-alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Optional: custom nginx configuration (uncomment if you have nginx.conf)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
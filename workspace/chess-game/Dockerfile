# -------------------------------------------------
# Stage 1: Build the static chess game assets
# -------------------------------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install only production dependencies (if any)
# If the project uses a build step (e.g., webpack, vite, etc.)
COPY package*.json ./
RUN npm ci --only=production

# Copy source files and build
COPY . .
RUN npm run build   # Assumes a script that outputs to ./dist

# -------------------------------------------------
# Stage 2: Serve the built assets with Nginx
# -------------------------------------------------
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the builder stage
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Expose HTTP port
EXPOSE 80

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
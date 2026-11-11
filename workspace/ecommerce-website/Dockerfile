# ------------------------------
# Stage 1 – Build the frontend app
# ------------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install only package definitions first (caches dependencies)
COPY package*.json ./
RUN npm ci --only=production

# Copy the rest of the source code
COPY . .

# Build the static assets (adjust if your script name differs)
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN npm run build

# ------------------------------
# Stage 2 – Serve with Nginx
# ------------------------------
FROM nginx:stable-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/build/ /usr/share/nginx/html/

# Optional: custom nginx config (uncomment if you have one)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
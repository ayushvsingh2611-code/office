# ------------------------------------------------------------
# Multi‑stage Dockerfile for a static two‑player chess game
# ------------------------------------------------------------

# ---------- Build Stage ----------
# Use a lightweight Node image to compile / bundle static assets
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package manifests (if any) and install dependencies
# (If the project is pure static HTML/JS/CSS, this step can be omitted)
COPY package*.json ./
RUN npm ci --silent || true

# Copy the source code
COPY . .

# Build the static site (adjust command to your build tool, e.g., Vite, Webpack, etc.)
# If no build step is required, you can skip this RUN line.
RUN npm run build || true

# ---------- Runtime Stage ----------
# Use the minimal official Nginx image
FROM nginx:alpine

# Remove default Nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the builder stage.
# If the build output directory differs, adjust the path accordingly.
COPY --from=builder /app/dist/ /usr/share/nginx/html/
# If you didn't have a build step, copy the raw files directly:
# COPY --from=builder /app/ /usr/share/nginx/html/

# Optional: add a custom Nginx configuration (uncomment if needed)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default HTTP port
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
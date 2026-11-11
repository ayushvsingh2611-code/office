# Stage 1: Build / Preparation (if build steps are needed, or static asset staging)
FROM alpine:3.18 AS builder
WORKDIR /app
# If "create canvas" has static source files, copy them here
COPY . /app

# Stage 2: Production Run using Nginx Alpine
FROM nginx:alpine

# Copy static web assets to Nginx default public directory
COPY --from=builder /app /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
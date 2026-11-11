# Production Nginx Deployment Container — CarePulse Health Management
# Maintained by Sanji (Chef & DevOps Engineer)

FROM nginx:alpine-slim

LABEL maintainer="Straw Hat Dev Crew <devs@pandahive.local>"
LABEL system="CarePulse Hospital ERP"
LABEL version="2.0.0"

# Copy static assets to Nginx html root
COPY . /usr/share/nginx/html/

# Copy hardened nginx configuration
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    gzip on; \
    gzip_types text/plain text/css application/javascript application/json image/svg+xml; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    add_header X-Frame-Options "SAMEORIGIN"; \
    add_header X-Content-Type-Options "nosniff"; \
    add_header Referrer-Policy "strict-origin-when-cross-origin"; \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

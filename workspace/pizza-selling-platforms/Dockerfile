# -------------------------------------------------
# Serve static site directly with Nginx (Alpine)
# -------------------------------------------------
FROM nginx:alpine

# Copy static frontend files directly into Nginx web root
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

# Expose HTTP port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

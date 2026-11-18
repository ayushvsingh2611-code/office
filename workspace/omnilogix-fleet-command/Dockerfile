FROM nginx:alpine

# Copy static frontend assets into standard Nginx webroot
COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY app.js /usr/share/nginx/html/app.js

# Expose standard HTTP port 80
EXPOSE 80

# Default Nginx command
CMD ["nginx", "-g", "daemon off;"]

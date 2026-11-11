FROM nginx:alpine

# Copy static assets to Nginx html directory
COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY app.js /usr/share/nginx/html/app.js

# Expose standard web port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

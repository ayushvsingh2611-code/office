FROM nginx:alpine

# Copy all project static files into Nginx default html directory
COPY . /usr/share/nginx/html

# Expose HTTP port 80
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

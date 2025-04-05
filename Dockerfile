# Use the official Nginx image as the base image
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy all the files from your project to the working directory
COPY index.html .
COPY style.css .
COPY script.js .
COPY README.md .
COPY imagens/ ./imagens/

# Expose port 80
EXPOSE 80

# Default command to start Nginx
CMD ["nginx", "-g", "daemon off;"]

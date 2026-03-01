# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy public files
COPY public/ .

# Install a simple HTTP server
RUN npm install -g http-server

# Expose port
EXPOSE 3000

# Start the server
CMD ["http-server", "-p", "3000", "-c-1"]

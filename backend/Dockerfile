# Use Node.js Alpine image for lightweight container
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory for file storage
RUN mkdir -p uploads

# Expose port 4000 (matching your server.js)
EXPOSE 4000

# Command to start the server
CMD ["npm", "start"]
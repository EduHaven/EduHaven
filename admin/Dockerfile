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

# Build the application
RUN npm run build

# Install serve to serve the built app
RUN npm install -g serve

# Expose port 5173 (default Vite preview port)
EXPOSE 5173

# Command to serve the built application
CMD ["serve", "-s", "dist", "-l", "5173"]
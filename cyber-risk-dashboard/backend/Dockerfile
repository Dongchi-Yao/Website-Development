# Backend Dockerfile for Node.js Express API
FROM node:18-alpine

# Install curl for health checks
RUN apk --no-cache add curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory with proper permissions
RUN mkdir -p uploads/profile-pictures && chmod 755 uploads/profile-pictures

# Expose port 5000
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["npm", "start"] 
#!/bin/bash

echo "🔧 Fixing API URL configuration issues..."

# Stop all containers
echo "⏹️ Stopping existing containers..."
sudo docker-compose down --remove-orphans

# Remove old images to force rebuild
echo "🗑️ Removing old images..."
sudo docker-compose down --rmi all --volumes --remove-orphans

# Build and start with new configuration
echo "🏗️ Building with new configuration..."
sudo docker-compose build --no-cache

echo "🚀 Starting services..."
sudo docker-compose up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Check service status
echo "📊 Checking service status..."
sudo docker-compose ps

echo "🏥 Checking health..."
echo "Frontend: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:8090/health)"
echo "Backend: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:50003/health)"
echo "Python Service: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:50004/health)"

echo ""
echo "✅ Configuration update complete!"
echo "🌐 Access your application at: http://localhost:8090"
echo "🔧 Backend API: http://localhost:50003"
echo "🐍 Python Service: http://localhost:50004"
echo ""
echo "📋 To view logs: sudo docker-compose logs -f [service-name]"

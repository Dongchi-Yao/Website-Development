#!/bin/bash

cd /home/smart/docker_builder_testing/cybersecurity/Website-Development/cyber-risk-dashboard

echo "🔧 Rebuilding frontend with fixed API URLs..."

# Stop and remove frontend container
echo "⏹️ Stopping frontend container..."
sudo docker stop cyber-risk-frontend
sudo docker rm cyber-risk-frontend

# Remove frontend image to force rebuild
echo "🗑️ Removing frontend image..."
sudo docker rmi cyber-risk-dashboard-frontend

# Build frontend with correct environment variables
echo "🏗️ Building frontend with new configuration..."
sudo docker build -f Dockerfile.frontend \
  --build-arg VITE_API_BASE_URL=/api \
  --build-arg VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY:-AIzaSyAEvhRPCe8185A6hcj8bDp-wCGLqL0xVew} \
  -t cyber-risk-dashboard-frontend .

# Start frontend container
echo "🚀 Starting frontend container..."
sudo docker run -d \
  --name cyber-risk-frontend \
  --network cyber-risk-dashboard_cyber-risk-network \
  -p 8090:80 \
  --restart unless-stopped \
  cyber-risk-dashboard-frontend

# Wait for container to start
echo "⏳ Waiting for frontend to start..."
sleep 10

# Check status
echo "📊 Checking status..."
sudo docker ps --filter name=cyber-risk-frontend

echo "🏥 Checking health..."
echo "Frontend: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:8090/health)"

echo ""
echo "✅ Frontend rebuild complete!"
echo "🌐 Access your application at: http://localhost:8090"
echo "Note: The application should now use relative API URLs instead of localhost:50003"

#!/bin/bash

echo "🔍 Checking Current API Configuration Status"
echo "=============================================="

# Check if containers are running
echo ""
echo "📊 Container Status:"
sudo docker ps --filter name=cyber-risk

# Check health endpoints
echo ""
echo "🏥 Health Checks:"
echo "Frontend: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:8090/health)"
echo "Backend: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:50003/health)"
echo "Python Service: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:50004/health)"

# Check API proxy
echo ""
echo "🔗 API Proxy Test:"
response=$(curl -s http://localhost:8090/api/auth/init-admin)
if [[ $response == *"Admin user"* ]]; then
    echo "✅ API proxy is working"
else
    echo "❌ API proxy failed"
fi

# Check if frontend contains hardcoded localhost URLs
echo ""
echo "🔍 Frontend Build Analysis:"
localhost_count=$(sudo docker exec cyber-risk-frontend find /usr/share/nginx/html/assets -name "*.js" -exec grep -l "localhost:50003" {} \; 2>/dev/null | wc -l)

if [ "$localhost_count" -gt 0 ]; then
    echo "❌ Frontend still contains hardcoded localhost:50003 URLs"
    echo "   This is the source of the API connection errors"
    echo "   Frontend needs to be rebuilt with updated source code"
else
    echo "✅ Frontend does not contain hardcoded localhost URLs"
fi

# Check current build date
echo ""
echo "📅 Frontend Build Info:"
sudo docker inspect cyber-risk-frontend --format='{{.Created}}' | cut -d'T' -f1

echo ""
echo "💡 If frontend needs rebuilding, run:"
echo "   sudo docker-compose down && sudo docker-compose build --no-cache && sudo docker-compose up -d"

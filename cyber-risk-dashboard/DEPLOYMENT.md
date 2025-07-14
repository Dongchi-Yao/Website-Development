# Cyber Risk Dashboard - Docker Deployment Guide

This guide explains how to deploy the Cyber Risk Dashboard using Docker containers.

## Architecture Overview

The application consists of four main services:
- **Frontend**: React application served by Nginx
- **Backend**: Node.js Express API server
- **Python Service**: FastAPI service for ML/AI processing
- **Database**: MongoDB for data persistence

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 1.29+
- At least 4GB RAM
- 10GB available disk space

## Quick Start (Development)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cyber-risk-dashboard
   ```

2. **Build and start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:8090
   - Backend API: http://localhost:50003
   - Python Service: http://localhost:50004
   - MongoDB: mongodb://localhost:27017

## Production Deployment

### Environment Setup

1. **Create production environment file**
   ```bash
   cp env.template .env
   ```

2. **Edit the .env file with your production values**
   ```bash
   # Critical: Change these values for production
   MONGODB_URI=mongodb://admin:your-secure-password@mongodb:27017/cyber-risk-dashboard?authSource=admin
   JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production
   MONGO_ROOT_USERNAME=admin
   MONGO_ROOT_PASSWORD=your-secure-password
   ```

### SSL Certificate Setup

1. **Create SSL certificate directory**
   ```bash
   mkdir -p nginx/ssl
   ```

2. **Generate self-signed certificate (for testing)**
   ```bash
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout nginx/ssl/key.pem \
     -out nginx/ssl/cert.pem \
     -subj "/CN=localhost"
   ```

3. **For production, use Let's Encrypt or your SSL provider**

### Production Deployment Commands

1. **Deploy with production configuration**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
   ```

2. **Check service status**
   ```bash
   docker-compose ps
   ```

3. **View logs**
   ```bash
   docker-compose logs -f [service-name]
   ```

## Service Configuration

### Frontend (React + Nginx)
- **Port**: 8090 (development), 80/443 (production)
- **Build**: Multi-stage build with Nginx
- **Features**: Static file serving, API proxying, SPA routing

### Backend (Node.js)
- **Port**: 50003
- **Environment**: Production optimized
- **Features**: Authentication, file uploads, API endpoints

### Python Service (FastAPI)
- **Port**: 50004
- **Environment**: ML/AI processing
- **Features**: Risk assessment, predictions, model serving

### Database (MongoDB)
- **Port**: 27017
- **Storage**: Persistent volumes
- **Features**: Authentication, indexes, replica set ready

## Monitoring and Health Checks

All services include health checks:
- **Frontend**: `curl -f http://localhost:80/health`
- **Backend**: `curl -f http://localhost:50003/health`
- **Python Service**: `curl -f http://localhost:50004/health`
- **MongoDB**: MongoDB ping command

## Backup and Recovery

### Database Backup
```bash
# Create backup
docker exec cyber-risk-mongodb mongodump --authenticationDatabase admin -u admin -p your-password --out /backup

# Restore backup
docker exec cyber-risk-mongodb mongorestore --authenticationDatabase admin -u admin -p your-password /backup
```

### Volume Backup
```bash
# Backup all volumes
docker run --rm -v cyber-risk-dashboard_mongodb_data:/data -v $(pwd)/backups:/backup alpine tar czf /backup/mongodb-backup.tar.gz /data
```

## Scaling and Performance

### Horizontal Scaling
```bash
# Scale backend service
docker-compose up -d --scale backend=3

# Scale python service
docker-compose up -d --scale python-service=2
```

### Resource Limits
Production configuration includes memory limits:
- Frontend: 128MB
- Backend: 512MB
- Python Service: 1GB
- MongoDB: 2GB (recommended)

## Security Considerations

1. **Change default passwords**
2. **Use strong JWT secrets**
3. **Enable SSL/TLS**
4. **Configure firewall rules**
5. **Regular security updates**
6. **Monitor access logs**

## Troubleshooting

### Common Issues

1. **Services not starting**
   ```bash
   # Check logs
   docker-compose logs [service-name]
   
   # Check resource usage
   docker stats
   ```

2. **Database connection issues**
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   
   # Test connection
   docker exec -it cyber-risk-mongodb mongosh --eval "db.adminCommand('ping')"
   ```

3. **Frontend not loading**
   ```bash
   # Check nginx configuration
   docker exec -it cyber-risk-frontend nginx -t
   
   # Reload nginx
   docker exec -it cyber-risk-frontend nginx -s reload
   ```

### Performance Optimization

1. **Enable MongoDB sharding for large datasets**
2. **Use Redis for session storage**
3. **Implement CDN for static assets**
4. **Enable database connection pooling**

## Maintenance

### Regular Tasks

1. **Update containers**
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

2. **Clean up unused resources**
   ```bash
   docker system prune -a
   ```

3. **Monitor disk usage**
   ```bash
   docker system df
   ```

### Log Management

Logs are automatically rotated with:
- Max size: 10MB per file
- Max files: 3 files per service
- Total log retention: ~30MB per service

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://mongodb:27017/cyber-risk-dashboard` |
| `JWT_SECRET` | JWT signing secret | `change-this-in-production` |
| `NODE_ENV` | Node.js environment | `production` |
| `PYTHONUNBUFFERED` | Python output buffering | `1` |
| `LOG_LEVEL` | Application log level | `info` |

## Support

For issues and questions:
1. Check the logs first
2. Review this documentation
3. Check Docker and system resources
4. Contact the development team

## License

This deployment configuration is part of the Cyber Risk Dashboard project. 
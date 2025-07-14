# Docker Setup - Cyber Risk Dashboard

This project has been fully dockerized for easy deployment and development.

## Quick Start

### Development
```bash
# Start all services
./deploy.sh

# OR manually
docker-compose up --build
```

### Production
```bash
# Production deployment
./deploy.sh -e production

# OR manually
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 8090 | React application with Nginx |
| Backend | 50003 | Node.js Express API |
| Python Service | 50004 | FastAPI for ML/AI processing |
| MongoDB | 27017 | Database |

## Scripts

### Deployment
- `./deploy.sh` - Main deployment script
- `./deploy.sh -e production` - Production deployment
- `./deploy.sh -h` - Show help

### Utilities
- `./docker-utils.sh logs` - View logs
- `./docker-utils.sh status` - Check service status
- `./docker-utils.sh restart` - Restart services
- `./docker-utils.sh health` - Health check
- `./docker-utils.sh backup` - Database backup
- `./docker-utils.sh clean` - Clean up Docker resources

## Environment Configuration

1. Copy the template: `cp env.template .env`
2. Edit `.env` with your values
3. For production, change:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `MONGO_ROOT_PASSWORD`

## Files Structure

```
cyber-risk-dashboard/
├── docker-compose.yml          # Main compose file
├── docker-compose.prod.yml     # Production overrides
├── Dockerfile.frontend         # Frontend container
├── nginx.conf                  # Nginx configuration
├── nginx/                      # Production nginx config
├── backend/
│   └── Dockerfile              # Backend container
├── backend/python_service/
│   └── Dockerfile              # Python service container
├── mongo-init.js               # MongoDB initialization
├── deploy.sh                   # Deployment script
├── docker-utils.sh             # Utility script
└── env.template                # Environment template
```

## Common Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f [service-name]

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up --build -d

# Check service status
docker-compose ps

# Scale services
docker-compose up -d --scale backend=3
```

## Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose logs [service-name]

# Check system resources
docker stats
```

### Database connection issues
```bash
# Check MongoDB logs
docker-compose logs mongodb

# Test MongoDB connection
docker exec -it cyber-risk-mongodb mongosh
```

### Reset everything
```bash
# Stop and remove everything
docker-compose down -v

# Remove all containers and images
docker system prune -a
```

## Production Considerations

1. **SSL Certificates**: Place SSL certs in `nginx/ssl/`
2. **Environment Variables**: Use strong secrets in production
3. **Backups**: Regular database backups with `./docker-utils.sh backup`
4. **Monitoring**: Monitor logs and resource usage
5. **Updates**: Regular security updates

## Access URLs

### Development
- Frontend: http://localhost:8090
- Backend: http://localhost:50003
- Python Service: http://localhost:50004

### Production
- Frontend: https://localhost
- Backend: https://localhost/api
- Python Service: https://localhost/python

For detailed documentation, see [DEPLOYMENT.md](DEPLOYMENT.md). 
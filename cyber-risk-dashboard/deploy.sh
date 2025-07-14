#!/bin/bash

# Cyber Risk Dashboard Deployment Script
# This script helps deploy the application in different environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="development"
BUILD_IMAGES=true
PULL_IMAGES=false
VERBOSE=false

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -e, --environment ENV    Set environment (development|production) [default: development]"
    echo "  -b, --build             Build images from source [default: true]"
    echo "  -p, --pull              Pull images from registry instead of building"
    echo "  -v, --verbose           Enable verbose output"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                      # Deploy development environment"
    echo "  $0 -e production -b     # Build and deploy production environment"
    echo "  $0 -e production -p     # Pull and deploy production environment"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -b|--build)
            BUILD_IMAGES=true
            PULL_IMAGES=false
            shift
            ;;
        -p|--pull)
            PULL_IMAGES=true
            BUILD_IMAGES=false
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Validate environment
if [[ "$ENVIRONMENT" != "development" && "$ENVIRONMENT" != "production" ]]; then
    print_error "Invalid environment: $ENVIRONMENT. Must be 'development' or 'production'"
    exit 1
fi

print_info "Starting deployment for environment: $ENVIRONMENT"

# Check if Docker is installed and running
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! docker info &> /dev/null; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Set compose files based on environment
if [[ "$ENVIRONMENT" == "production" ]]; then
    COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"
    print_info "Using production configuration"
    
    # Check if environment file exists
    if [[ ! -f ".env" ]]; then
        print_warning "No .env file found. Creating from template..."
        if [[ -f "env.template" ]]; then
            cp env.template .env
            print_warning "Please edit .env file with your production values before continuing"
            print_warning "Critical: Change MONGODB_URI, JWT_SECRET, and MONGO_ROOT_PASSWORD"
            read -p "Press Enter to continue after editing .env file..."
        else
            print_error "No env.template file found. Cannot create .env file."
            exit 1
        fi
    fi
    
    # Check if SSL certificates exist
    if [[ ! -d "nginx/ssl" ]]; then
        print_warning "SSL certificates not found. Creating self-signed certificates..."
        mkdir -p nginx/ssl
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout nginx/ssl/key.pem \
            -out nginx/ssl/cert.pem \
            -subj "/CN=localhost" \
            -batch
        print_warning "Self-signed certificates created. Use proper SSL certificates for production."
    fi
else
    COMPOSE_FILES="-f docker-compose.yml"
    print_info "Using development configuration"
fi

# Stop existing containers
print_info "Stopping existing containers..."
docker-compose $COMPOSE_FILES down --remove-orphans

# Pull or build images
if [[ "$PULL_IMAGES" == true ]]; then
    print_info "Pulling images..."
    docker-compose $COMPOSE_FILES pull
elif [[ "$BUILD_IMAGES" == true ]]; then
    print_info "Building images..."
    if [[ "$VERBOSE" == true ]]; then
        docker-compose $COMPOSE_FILES build --no-cache
    else
        docker-compose $COMPOSE_FILES build --no-cache --quiet
    fi
fi

# Start services
print_info "Starting services..."
if [[ "$VERBOSE" == true ]]; then
    docker-compose $COMPOSE_FILES up -d
else
    docker-compose $COMPOSE_FILES up -d --quiet-pull
fi

# Wait for services to be healthy
print_info "Waiting for services to be healthy..."
sleep 10

# Check service status
print_info "Checking service status..."
docker-compose $COMPOSE_FILES ps

# Test health endpoints
print_info "Testing health endpoints..."

# Wait for services to be ready
for i in {1..30}; do
    if docker-compose $COMPOSE_FILES ps | grep -q "Up (healthy)"; then
        break
    fi
    echo -n "."
    sleep 2
done
echo ""

# Test individual services
services=("frontend" "backend" "python-service")
for service in "${services[@]}"; do
    if docker-compose $COMPOSE_FILES ps | grep -q "$service.*Up"; then
        print_info "✓ $service is running"
    else
        print_error "✗ $service is not running"
    fi
done

# Show access information
print_info "Deployment completed successfully!"
echo ""
echo "Access your application at:"
if [[ "$ENVIRONMENT" == "production" ]]; then
    echo "  - Frontend: https://localhost"
    echo "  - Backend API: https://localhost/api"
    echo "  - Python Service: https://localhost/python"
else
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend API: http://localhost:5000"
    echo "  - Python Service: http://localhost:8000"
    echo "  - MongoDB: mongodb://localhost:27017"
fi
echo ""
print_info "To view logs: docker-compose $COMPOSE_FILES logs -f [service-name]"
print_info "To stop: docker-compose $COMPOSE_FILES down"
print_info "To restart: docker-compose $COMPOSE_FILES restart [service-name]" 
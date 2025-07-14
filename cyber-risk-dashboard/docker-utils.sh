#!/bin/bash

# Docker Utilities Script for Cyber Risk Dashboard
# Common Docker operations for development and maintenance

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  logs [service]          Show logs for all services or specific service"
    echo "  status                  Show status of all services"
    echo "  restart [service]       Restart all services or specific service"
    echo "  stop                    Stop all services"
    echo "  start                   Start all services"
    echo "  clean                   Clean up unused Docker resources"
    echo "  backup                  Create database backup"
    echo "  restore [backup-file]   Restore database from backup"
    echo "  shell [service]         Open shell in service container"
    echo "  update                  Update and restart services"
    echo "  monitoring              Show resource usage"
    echo "  health                  Check health of all services"
    echo ""
    echo "Examples:"
    echo "  $0 logs backend         # Show backend logs"
    echo "  $0 restart             # Restart all services"
    echo "  $0 shell mongodb       # Open shell in MongoDB container"
    echo "  $0 backup              # Create database backup"
}

# Check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
}

# Determine compose files
get_compose_files() {
    if [[ -f "docker-compose.prod.yml" && -f ".env" ]]; then
        echo "-f docker-compose.yml -f docker-compose.prod.yml"
    else
        echo "-f docker-compose.yml"
    fi
}

# Show logs
show_logs() {
    local service=$1
    local compose_files=$(get_compose_files)
    
    if [[ -z "$service" ]]; then
        print_info "Showing logs for all services"
        docker-compose $compose_files logs -f --tail=100
    else
        print_info "Showing logs for service: $service"
        docker-compose $compose_files logs -f --tail=100 "$service"
    fi
}

# Show status
show_status() {
    local compose_files=$(get_compose_files)
    
    print_header "Service Status"
    docker-compose $compose_files ps
    
    print_header "Resource Usage"
    docker stats --no-stream
}

# Restart services
restart_services() {
    local service=$1
    local compose_files=$(get_compose_files)
    
    if [[ -z "$service" ]]; then
        print_info "Restarting all services"
        docker-compose $compose_files restart
    else
        print_info "Restarting service: $service"
        docker-compose $compose_files restart "$service"
    fi
}

# Stop services
stop_services() {
    local compose_files=$(get_compose_files)
    
    print_info "Stopping all services"
    docker-compose $compose_files down
}

# Start services
start_services() {
    local compose_files=$(get_compose_files)
    
    print_info "Starting all services"
    docker-compose $compose_files up -d
}

# Clean up Docker resources
clean_docker() {
    print_warning "This will remove unused Docker resources"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Cleaning up unused Docker resources"
        docker system prune -a --volumes -f
        print_info "Cleanup completed"
    else
        print_info "Cleanup cancelled"
    fi
}

# Backup database
backup_database() {
    local backup_dir="backups"
    local backup_file="mongodb-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    
    mkdir -p "$backup_dir"
    
    print_info "Creating database backup: $backup_file"
    
    # Check if MongoDB container is running
    if ! docker ps | grep -q "cyber-risk-mongodb"; then
        print_error "MongoDB container is not running"
        exit 1
    fi
    
    # Create backup
    docker exec cyber-risk-mongodb mongodump --authenticationDatabase admin -u admin -p password --out /tmp/backup
    docker run --rm -v cyber-risk-dashboard_mongodb_data:/data -v "$(pwd)/$backup_dir":/backup alpine tar czf "/backup/$backup_file" /data
    
    print_info "Backup created: $backup_dir/$backup_file"
}

# Restore database
restore_database() {
    local backup_file=$1
    
    if [[ -z "$backup_file" ]]; then
        print_error "Please specify backup file"
        exit 1
    fi
    
    if [[ ! -f "$backup_file" ]]; then
        print_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    print_warning "This will restore database from: $backup_file"
    print_warning "Current database will be overwritten"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Restoring database from backup"
        docker run --rm -v cyber-risk-dashboard_mongodb_data:/data -v "$(pwd)":/backup alpine tar xzf "/backup/$backup_file" -C /
        print_info "Database restored successfully"
    else
        print_info "Restore cancelled"
    fi
}

# Open shell in container
open_shell() {
    local service=$1
    
    if [[ -z "$service" ]]; then
        print_error "Please specify service name"
        exit 1
    fi
    
    local container_name="cyber-risk-$service"
    
    if ! docker ps | grep -q "$container_name"; then
        print_error "Container $container_name is not running"
        exit 1
    fi
    
    print_info "Opening shell in $service container"
    case $service in
        "mongodb")
            docker exec -it "$container_name" mongosh
            ;;
        "backend"|"frontend")
            docker exec -it "$container_name" sh
            ;;
        "python-service")
            docker exec -it "$container_name" bash
            ;;
        *)
            docker exec -it "$container_name" sh
            ;;
    esac
}

# Update services
update_services() {
    local compose_files=$(get_compose_files)
    
    print_info "Updating services"
    docker-compose $compose_files pull
    docker-compose $compose_files up -d
    
    print_info "Services updated successfully"
}

# Show monitoring information
show_monitoring() {
    print_header "Docker System Information"
    docker system df
    
    print_header "Container Resource Usage"
    docker stats --no-stream
    
    print_header "Volume Information"
    docker volume ls
    
    print_header "Network Information"
    docker network ls
}

# Check health of all services
check_health() {
    local compose_files=$(get_compose_files)
    
    print_header "Health Check Results"
    
    # Check container health
    services=("frontend" "backend" "python-service" "mongodb")
    for service in "${services[@]}"; do
        container_name="cyber-risk-$service"
        if docker ps | grep -q "$container_name"; then
            health_status=$(docker inspect --format='{{.State.Health.Status}}' "$container_name" 2>/dev/null || echo "no-health-check")
            if [[ "$health_status" == "healthy" ]]; then
                print_info "✓ $service is healthy"
            elif [[ "$health_status" == "no-health-check" ]]; then
                print_info "? $service is running (no health check)"
            else
                print_error "✗ $service is unhealthy"
            fi
        else
            print_error "✗ $service is not running"
        fi
    done
    
    # Test HTTP endpoints
    print_header "Endpoint Tests"
    
    endpoints=(
        "frontend:8090:/health"
        "backend:50003:/health"
        "python-service:50004:/health"
    )
    
    for endpoint in "${endpoints[@]}"; do
        IFS=':' read -r service port path <<< "$endpoint"
        if curl -f -s "http://localhost:$port$path" > /dev/null 2>&1; then
            print_info "✓ $service endpoint is responding"
        else
            print_error "✗ $service endpoint is not responding"
        fi
    done
}

# Main script logic
check_docker_compose

case $1 in
    "logs")
        show_logs $2
        ;;
    "status")
        show_status
        ;;
    "restart")
        restart_services $2
        ;;
    "stop")
        stop_services
        ;;
    "start")
        start_services
        ;;
    "clean")
        clean_docker
        ;;
    "backup")
        backup_database
        ;;
    "restore")
        restore_database $2
        ;;
    "shell")
        open_shell $2
        ;;
    "update")
        update_services
        ;;
    "monitoring")
        show_monitoring
        ;;
    "health")
        check_health
        ;;
    *)
        show_usage
        exit 1
        ;;
esac 
#!/bin/bash

# Smart Admin v4 - Laravel + React + Inertia.js Setup Script
# This script initializes the Laravel project with Breeze (React + Inertia.js)

set -e

echo "🚀 Smart Admin v4 Setup"
echo "========================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create src directory if it doesn't exist
mkdir -p src

# Check if Laravel is already installed
if [ -f "src/artisan" ]; then
    echo "⚠️  Laravel is already installed in ./src"
    read -p "Do you want to reinstall? This will delete the existing installation. (y/N): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "Setup cancelled."
        exit 0
    fi
    rm -rf src/*
    rm -rf src/.*  2>/dev/null || true
fi

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
fi

echo ""
echo "📦 Installing Laravel..."
echo ""

# Create Laravel project using composer in a temporary container
docker run --rm -v "$(pwd)/src:/app" -w /app composer:latest \
    composer create-project laravel/laravel . --prefer-dist

echo ""
echo "✅ Laravel installed successfully!"
echo ""

# Build the PHP container
echo "🔨 Building Docker containers..."
docker compose build app

# Start MySQL and Redis first
echo "🗄️  Starting database services..."
docker compose up -d mysql redis

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
until docker compose exec -T mysql mysqladmin ping -h localhost -u root -psecret --silent 2>/dev/null; do
    sleep 2
done
echo "✅ MySQL is ready!"

# Configure Laravel .env for Docker
echo ""
echo "⚙️  Configuring Laravel for Docker..."

cat > src/.env << 'EOF'
APP_NAME="Smart Admin"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=smart_admin
DB_USERNAME=smart_admin
DB_PASSWORD=secret

BROADCAST_DRIVER=log
CACHE_DRIVER=redis
FILESYSTEM_DISK=local
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

VITE_APP_NAME="${APP_NAME}"
EOF

echo "✅ Laravel .env configured!"

# Start the app container
echo ""
echo "🚀 Starting application container..."
docker compose up -d app nginx

# Generate application key
echo ""
echo "🔑 Generating application key..."
docker compose exec -T app php artisan key:generate

# Install Laravel Breeze with React and Inertia.js
echo ""
echo "📦 Installing Laravel Breeze with React + Inertia.js..."
docker compose exec -T app composer require laravel/breeze --dev

echo ""
echo "⚙️  Setting up Breeze with React stack..."
docker compose exec -T app php artisan breeze:install react

# Install npm dependencies and build
echo ""
echo "📦 Installing npm dependencies..."
docker compose exec -T app npm install

echo ""
echo "🔨 Building frontend assets..."
docker compose exec -T app npm run build

# Run migrations
echo ""
echo "🗄️  Running database migrations..."
docker compose exec -T app php artisan migrate

# Set proper permissions
echo ""
echo "🔒 Setting file permissions..."
docker compose exec -T app chmod -R 775 storage bootstrap/cache

echo ""
echo "=========================================="
echo "✅ Smart Admin v4 Setup Complete!"
echo "=========================================="
echo ""
echo "🌐 Application: http://localhost"
echo ""
echo "📚 Available Commands:"
echo "  docker compose up -d                    # Start all services"
echo "  docker compose --profile dev up -d      # Start with Vite dev server"
echo "  docker compose --profile tools up -d    # Start with phpMyAdmin & Redis Commander"
echo "  docker compose down                     # Stop all services"
echo ""
echo "🛠️  Dev Tools (when using --profile tools):"
echo "  phpMyAdmin:      http://localhost:8080"
echo "  Redis Commander: http://localhost:8081"
echo ""
echo "📝 Useful Commands:"
echo "  docker compose exec app php artisan     # Run Artisan commands"
echo "  docker compose exec app composer        # Run Composer commands"
echo "  docker compose exec app npm             # Run npm commands"
echo ""

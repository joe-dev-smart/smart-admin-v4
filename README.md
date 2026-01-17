# Smart Admin v4

A Docker-based Laravel starter kit with React, Inertia.js, MySQL, and Redis.

## Stack

- **PHP 8.4** with Laravel 12
- **React** with Inertia.js (via Laravel Breeze)
- **MySQL 8.0**
- **Redis** (for cache, sessions, and queues)
- **Nginx** (web server)
- **Node.js 20** (for Vite)

## Requirements

- Docker & Docker Compose
- Git

## Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd smart-admin-v4
   ```

2. Run the setup script:
   ```bash
   ./setup.sh
   ```

3. Access the application at `http://localhost`

## Manual Setup

If you prefer manual setup:

```bash
# Copy environment file
cp .env.example .env

# Build and start containers
docker compose up -d --build

# Install Laravel (if src/ is empty)
docker run --rm -v "$(pwd)/src:/app" -w /app composer:latest \
    composer create-project laravel/laravel . --prefer-dist

# Install Breeze with React
docker compose exec app composer require laravel/breeze --dev
docker compose exec app php artisan breeze:install react
docker compose exec app npm install
docker compose exec app npm run build
docker compose exec app php artisan migrate
```

## Services

| Service | URL | Description |
|---------|-----|-------------|
| Application | http://localhost | Main Laravel application |
| phpMyAdmin | http://localhost:8080 | Database management (requires `--profile tools`) |
| Redis Commander | http://localhost:8081 | Redis management (requires `--profile tools`) |
| Vite Dev Server | http://localhost:5173 | HMR development (requires `--profile dev`) |

## Common Commands

### Docker Compose

```bash
# Start core services
docker compose up -d

# Start with development tools
docker compose --profile tools up -d

# Start with Vite dev server for HMR
docker compose --profile dev up -d

# Start all profiles
docker compose --profile dev --profile tools up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f

# Rebuild containers
docker compose up -d --build
```

### Laravel Artisan

```bash
docker compose exec app php artisan migrate
docker compose exec app php artisan db:seed
docker compose exec app php artisan make:model ModelName -mcr
docker compose exec app php artisan queue:work
docker compose exec app php artisan tinker
```

### Composer

```bash
docker compose exec app composer install
docker compose exec app composer require package/name
docker compose exec app composer update
```

### NPM

```bash
docker compose exec app npm install
docker compose exec app npm run dev
docker compose exec app npm run build
```

## Project Structure

```
smart-admin-v4/
├── docker/
│   ├── mysql/
│   │   └── my.cnf           # MySQL configuration
│   ├── nginx/
│   │   └── conf.d/
│   │       └── app.conf     # Nginx configuration
│   └── php/
│       ├── Dockerfile       # PHP-FPM image
│       └── local.ini        # PHP configuration
├── src/                     # Laravel application
├── .env.example             # Docker environment template
├── docker-compose.yml       # Docker services
├── setup.sh                 # Automated setup script
└── README.md
```

## Environment Variables

Docker Compose variables (`.env` in project root):

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_PORT` | 80 | Application port |
| `DB_DATABASE` | smart_admin | Database name |
| `DB_USERNAME` | smart_admin | Database user |
| `DB_PASSWORD` | secret | Database password |
| `DB_PORT` | 3306 | MySQL port |
| `REDIS_PORT` | 6379 | Redis port |
| `VITE_PORT` | 5173 | Vite dev server port |
| `PHPMYADMIN_PORT` | 8080 | phpMyAdmin port |
| `REDIS_COMMANDER_PORT` | 8081 | Redis Commander port |

## Development Workflow

1. Start services with dev profile for hot module replacement:
   ```bash
   docker compose --profile dev up -d
   ```

2. Make changes to React components in `src/resources/js/`

3. Changes will automatically reload in the browser

## Production Considerations

For production deployment:

1. Update `src/.env`:
   - Set `APP_ENV=production`
   - Set `APP_DEBUG=false`
   - Use strong passwords
   - Configure proper `APP_URL`

2. Build production assets:
   ```bash
   docker compose exec app npm run build
   ```

3. Optimize Laravel:
   ```bash
   docker compose exec app php artisan config:cache
   docker compose exec app php artisan route:cache
   docker compose exec app php artisan view:cache
   ```

## License

MIT

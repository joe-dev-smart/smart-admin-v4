# Smart Admin v4

A Docker-based Laravel starter kit with React, Inertia.js, MySQL, and Redis.

## Stack

- **PHP 8.4** with Laravel 12
- **React 19** with Inertia.js 2.x
- **MySQL 8.0**
- **Redis** (for cache, sessions, and queues)
- **Nginx** (web server)
- **Node.js 20** (for Vite - via separate container or host)

## Requirements

- Docker & Docker Compose
- Git
- Node.js 20+ (on host machine, for running npm commands)

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

## Services

| Service | URL | Description |
|---------|-----|-------------|
| Application | http://localhost | Main Laravel application |
| phpMyAdmin | http://localhost:8080 | Database management (requires `--profile tools`) |
| Redis Commander | http://localhost:8081 | Redis management (requires `--profile tools`) |
| Vite Dev Server | http://localhost:5173 | HMR development (requires `--profile dev`) |

## Common Commands

### Docker Services

```bash
# Start core services (app, nginx, mysql, redis)
docker compose up -d

# Start with development tools (phpMyAdmin, Redis Commander)
docker compose --profile tools up -d

# Start with Vite dev server for HMR (hot reload)
docker compose --profile dev up -d

# Start all services
docker compose --profile dev --profile tools up -d

# Stop all services
docker compose down

# View logs (all services)
docker compose logs -f

# View logs (specific service)
docker compose logs -f app

# Rebuild containers after Dockerfile changes
docker compose up -d --build

# Restart a specific service
docker compose restart app
```

### Laravel Artisan Commands

```bash
# Run migrations
docker compose exec app php artisan migrate

# Run migrations fresh (drop all tables and re-migrate)
docker compose exec app php artisan migrate:fresh

# Run database seeders
docker compose exec app php artisan db:seed

# Run migrations + seeders
docker compose exec app php artisan migrate:fresh --seed

# Create model with migration, controller, and resource
docker compose exec app php artisan make:model ModelName -mcr

# Create a controller
docker compose exec app php artisan make:controller ControllerName

# Create a middleware
docker compose exec app php artisan make:middleware MiddlewareName

# List all routes
docker compose exec app php artisan route:list

# Clear all caches
docker compose exec app php artisan optimize:clear

# Start queue worker
docker compose exec app php artisan queue:work

# Laravel Tinker (REPL)
docker compose exec app php artisan tinker
```

### Composer Commands

```bash
# Install dependencies
docker compose exec app composer install

# Add a package
docker compose exec app composer require package/name

# Add a dev package
docker compose exec app composer require package/name --dev

# Update all packages
docker compose exec app composer update

# Dump autoload
docker compose exec app composer dump-autoload
```

### NPM Commands (run on host machine)

> **Note:** The PHP container does not have Node.js installed. Run npm commands from the `src/` directory on your host machine.

```bash
cd src

# Install dependencies
npm install

# Development build with watch
npm run dev

# Production build
npm run build

# Add a package
npm install package-name

# Add a dev package
npm install package-name --save-dev
```

### Alternative: NPM via Docker (with dev profile)

If you prefer to run npm inside Docker:

```bash
# Start the node container
docker compose --profile dev up -d

# Run npm commands via the node service
docker compose exec node npm install
docker compose exec node npm run build
```

### Database Access

```bash
# Access MySQL CLI
docker compose exec mysql mysql -u smart_admin -psecret smart_admin

# Export database
docker compose exec mysql mysqldump -u smart_admin -psecret smart_admin > backup.sql

# Import database
docker compose exec -T mysql mysql -u smart_admin -psecret smart_admin < backup.sql
```

### Container Shell Access

```bash
# PHP container (for artisan, composer, etc.)
docker compose exec app bash

# MySQL container
docker compose exec mysql bash

# Node container (requires --profile dev)
docker compose exec node sh
```

## Project Structure

```
smart-admin-v4/
├── docker/
│   ├── mysql/
│   │   └── my.cnf              # MySQL configuration
│   ├── nginx/
│   │   └── conf.d/
│   │       └── app.conf        # Nginx configuration
│   └── php/
│       ├── Dockerfile          # PHP-FPM image
│       └── local.ini           # PHP configuration
├── src/                        # Laravel application
│   ├── app/                    # PHP application code
│   ├── resources/
│   │   ├── js/                 # React components
│   │   │   ├── components/     # Reusable components
│   │   │   ├── config/         # App config & labels
│   │   │   ├── context/        # React contexts
│   │   │   ├── layouts/        # Layout components
│   │   │   └── Pages/          # Inertia pages
│   │   └── scss/               # Stylesheets
│   ├── routes/
│   │   └── web.php             # Web routes
│   └── .env                    # Laravel environment
├── .env.example                # Docker environment template
├── docker-compose.yml          # Docker services
├── setup.sh                    # Automated setup script
└── README.md
```

## Configuration Files

### Labels & Translations

All UI text is centralized in `src/resources/js/config/labels.js`:

```javascript
export const auth = {
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    // Change text here to update everywhere it's used
};
```

### App Configuration

Application settings in `src/resources/js/config/app.js`:

```javascript
export const appConfig = {
    company: { name: 'SMART IDEAS', ... },
    assets: { logo: '/images/logo.png', ... },
    colors: { primary: '#00b8b8', ... },
};
```

### Styling (SCSS)

To change colors or styles, edit:

- `src/resources/scss/_variables.scss` - Bootstrap/app variables
- `src/resources/scss/pages/_auth.scss` - Auth pages styling

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

### Option 1: Hot Module Replacement (HMR)

For real-time updates while developing React components:

```bash
# Start Docker services with Vite dev server
docker compose --profile dev up -d

# Access http://localhost - changes auto-reload
```

### Option 2: Manual Build

```bash
# Start Docker services
docker compose up -d

# Watch for changes (run in src/ on host)
cd src && npm run dev

# Or build once after changes
cd src && npm run build
```

## Production Deployment

1. Update `src/.env`:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://your-domain.com
   ```

2. Build production assets:
   ```bash
   cd src && npm run build
   ```

3. Optimize Laravel:
   ```bash
   docker compose exec app php artisan config:cache
   docker compose exec app php artisan route:cache
   docker compose exec app php artisan view:cache
   docker compose exec app php artisan event:cache
   ```

## Troubleshooting

### Container won't start
```bash
docker compose logs -f app
docker compose down -v
docker compose up -d --build
```

### Permission issues
```bash
docker compose exec app chmod -R 775 storage bootstrap/cache
docker compose exec app chown -R www-data:www-data storage bootstrap/cache
```

### Clear all caches
```bash
docker compose exec app php artisan optimize:clear
cd src && rm -rf node_modules/.vite public/build && npm run build
```

### Database connection issues
```bash
docker compose ps
docker compose exec app php artisan db:monitor
```

## License

MIT

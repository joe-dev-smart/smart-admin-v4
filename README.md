# Smart Admin v4

## Stack

| Layer | Technology |
|-------|-----------|
| Backend | PHP 8.4 · Laravel 12 |
| Frontend | React 19 · Inertia.js 2 · Vite 7 |
| Database | MySQL 8.0 |
| Cache / Sessions | Redis |
| Web server | Nginx |

**Requirements:** Docker · Docker Compose · Git

---

## Local Development

```bash
# Start all services + Vite hot-reload
docker compose --profile dev up -d

# Stop
docker compose down
```

| URL | Description |
|-----|-------------|
| http://localhost | Application |
| http://localhost:5173 | Vite HMR dev server |
| http://localhost:8080 | phpMyAdmin (add `--profile tools`) |

```bash
# Optional dev tools (phpMyAdmin + Redis Commander)
docker compose --profile dev --profile tools up -d
```

### phpMyAdmin credentials

| Field | Value |
|-------|-------|
| URL | http://localhost:8080 |
| Username | `smart_admin` |
| Password | `secret` |
| Database | `smart_admin` |

### First-time setup

```bash
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate
docker compose exec app php artisan db:seed --class=RolesAndPermissionsSeeder
```

### Useful commands

```bash
# Run migrations
docker compose exec app php artisan migrate

# Clear all caches
docker compose exec app php artisan optimize:clear

# Open a shell inside the PHP container
docker compose exec app bash

# Access MySQL CLI
docker compose exec mysql mysql -u smart_admin -psecret smart_admin
```

---

## Production Deployment

```bash
# 1. Clone and enter the project
git clone <repository-url> && cd smart-admin-v4

# 2. Copy and configure environment files
cp .env.example .env                   # Docker Compose vars
cp src/.env.example src/.env           # Laravel vars — edit APP_URL, DB_*, APP_DEBUG=false

# 3. Build the PHP image
docker compose build app

# 4. Start core services (no Vite, no dev tools)
docker compose up -d

# 5. First deploy
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate --force
docker compose exec app php artisan db:seed --class=RolesAndPermissionsSeeder

# 6. Build frontend assets (inside the node container, one-off)
docker compose run --rm node npm run build

# 7. Optimize Laravel for production
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache
docker compose exec app php artisan view:cache
docker compose exec app php artisan event:cache
```

### Subsequent deploys (after pulling new code)

```bash
git pull
docker compose exec app composer install --no-dev --optimize-autoloader
docker compose run --rm node npm run build
docker compose exec app php artisan migrate --force
docker compose exec app php artisan optimize
```

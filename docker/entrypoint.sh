#!/bin/sh

set -e

cd /var/www

# Install dependencies if needed
if [ ! -d "vendor" ]; then
  composer install
fi

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
  php artisan key:generate
fi

# Wait for database to be ready
echo "Waiting for database..."
while ! mysqladmin ping -h"db" -u"${DB_USERNAME}" -p"${DB_PASSWORD}" --silent; do
    sleep 1
done

# Run database migrations
php artisan migrate --force

# Clear cache
php artisan optimize:clear

exec "$@"
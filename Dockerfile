# Stage 1: Build frontend
FROM node:18 AS frontend-builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN yarn install --frozen-lockfile

# Copy frontend files
COPY resources/js ./resources/js
COPY tsconfig.json ./resources/
COPY vite.config.ts ./

# Build assets
RUN yarn build

# Stage 2: Build backend
FROM composer:2 AS backend-builder

WORKDIR /app

# Install PHP dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --prefer-dist --optimize-autoloader --ignore-platform-req=ext-gd

# Stage 3: Production image
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    default-mysql-client

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Configure PHP
COPY docker/php/php.ini /usr/local/etc/php/conf.d/app.ini

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . /var/www
COPY --from=backend-builder /app/vendor ./vendor
COPY --from=frontend-builder /app/public/build ./public/build

# Set permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

CMD ["php-fpm"]
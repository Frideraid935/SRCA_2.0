FROM php:8.2-cli

WORKDIR /var/www/html

COPY ./app .

RUN docker-php-ext-install mysqli pdo pdo_mysql

# Railway expone este puerto dinámicamente
EXPOSE 8080

# 🔥 USAR EL PUERTO DE RAILWAY
CMD ["sh", "-c", "php -S 0.0.0.0:${PORT} -t /var/www/html"]

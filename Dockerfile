FROM php:8.2-cli

# Directorio de trabajo
WORKDIR /var/www/html

# Copiar tu aplicación
COPY ./app .

# Extensiones PHP necesarias
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Railway usa este puerto
EXPOSE 8080

# Iniciar servidor PHP
CMD ["php", "-S", "0.0.0.0:8080", "-t", "/var/www/html"]

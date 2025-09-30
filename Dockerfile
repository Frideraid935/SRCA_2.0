FROM php:8.2-apache

# Copiar tu aplicación al contenedor
COPY ./app /var/www/html

# Instalar extensiones PHP necesarias
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Configuración de Apache para evitar Forbidden
RUN echo '<Directory /var/www/html>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/custom.conf && \
    a2enconf custom

# Habilitar mod_rewrite (útil para URLs amigables)
RUN a2enmod rewrite

# Puerto correcto
EXPOSE 80

# Iniciar Apache
CMD ["apache2-foreground"]
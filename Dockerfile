FROM php:8.2-cli

WORKDIR /var/www/html

COPY ./app .

RUN docker-php-ext-install mysqli pdo pdo_mysql

EXPOSE 8080

CMD sh -c 'echo "PORT=$PORT" && php -S 0.0.0.0:${PORT:-8080} -t /var/www/html'

FROM php:8.2-apache

# Instala suporte a SQLite e ativa o mod_rewrite
RUN apt-get update && apt-get install -y libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite \
    && a2enmod rewrite

# Copia os arquivos do backend para o servidor web
COPY . /var/www/html/

# Garante a existência do diretório e ajusta as permissões de gravação do SQLite
RUN mkdir -p /var/www/html \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 777 /var/www/html

EXPOSE 80

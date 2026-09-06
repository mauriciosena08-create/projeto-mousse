FROM php:8.2-apache

# Instala suporte a SQLite e habilita o mod_rewrite
RUN apt-get update && apt-get install -y libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite \
    && a2enmod rewrite

# Copia os arquivos do backend para o container
COPY . /var/www/html/

# Ajusta as permissões da pasta e dos arquivos para escrita do SQLite
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 777 /var/www/html

EXPOSE 80

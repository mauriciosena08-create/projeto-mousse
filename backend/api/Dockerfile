FROM php:8.2-apache

# Instala suporte a SQLite e habilita o mod_rewrite do Apache
RUN apt-get update && apt-get install -y libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite \
    && a2enmod rewrite

# Copia os arquivos do backend para a pasta do servidor
COPY . /var/www/html/

# Dá permissão para o PHP criar/escrever no arquivo do banco de dados SQLite
RUN chown -R www-data:www-data /var/www/html/

EXPOSE 80

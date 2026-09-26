FROM php:8.2-apache

# Ativa o mod_rewrite do Apache
RUN a2enmod rewrite

# Copia os arquivos do backend para o servidor web
COPY . /var/www/html/

EXPOSE 80

FROM php:7.1-apache
MAINTAINER Elze Kool

RUN apt-get update \
 && apt-get install zlib1g-dev \
 && rm -rf /var/lib/apt/lists/* \
 && docker-php-ext-install bcmath \
 && docker-php-ext-install zip

RUN usermod -u 1000 www-data \
 && groupmod -g 1000 www-data \
 && chown -R www-data:www-data /var/www/



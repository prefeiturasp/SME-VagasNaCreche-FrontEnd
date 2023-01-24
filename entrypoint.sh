#!/bin/bash
# Replace string in static files
# sed -i "s/old-text/new-text/g" input.txt

set -xe
  : "${SERVER_NAME?Precisa de uma variavel de ambiente SERVER_NAME}"

set -xe
  : "${API_URL?Precisa de uma variavel de ambiente API_URL}"

set -xe
  : "${API_ENDERECO?Precisa de uma variavel de ambiente API_ENDERECO}"

set -xe
  : "${URL_VIDEO?Precisa de uma variavel de ambiente URL_VIDEO}"

sed -i "s,SERVER_NAME,$SERVER_NAME,g" /etc/nginx/conf.d/default.conf
sed -i "s,REPLACE_API_URL,$API_URL,g" /usr/share/nginx/html/static/js/*.js
sed -i "s,REPLACE_API_ENDERECO,$API_ENDERECO,g" /usr/share/nginx/html/static/js/*.js
sed -i "s,REPLACE_URL_VIDEO,$URL_VIDEO,g" /usr/share/nginx/html/static/js/*.js


exec "$@"

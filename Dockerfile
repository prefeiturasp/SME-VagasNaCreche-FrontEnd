FROM node:12.13.0 as build
WORKDIR /app
COPY . ./
#RUN apk update && apk add python2 make
RUN npm install && npm rebuild node-sass --force && npm run build


FROM nginx
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
COPY --from=build /app/build /usr/share/nginx/html
COPY ./conf/default.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

FROM node:12.13.0-alpine as react-build
RUN mkdir -p /opt/services/front/src
RUN mkdir -p /usr/share/nginx/html
WORKDIR /opt/services/front/src
COPY . /opt/services/front/src
RUN yarn install
RUN yarn build
RUN cp -r /opt/services/front/src/build /usr/share/nginx/html
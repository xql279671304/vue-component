FROM node:7

MAINTAINER xqling <279671304@qq.com>
LABEL Descripttion="This image is build for web"

RUN mkdir -p /opt/apps
COPY .  /opt/apps

WORKDIR /opt/apps/build/server
ENV LANG C.UTF-8

ADD nginx.conf /etc/nginx/
ADD dist /usr/share/nginx/html/

EXPOSE 8088

CMD [ "npm", "dev" ]
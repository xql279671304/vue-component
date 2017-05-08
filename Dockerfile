FROM node:7

MAINTAINER xqling <279671304@qq.com>
LABEL Descripttion="This image is build for web"

RUN mkdir -p /opt/apps
COPY .  /opt/apps

WORKDIR /opt/apps/build/server
ENV LANG C.UTF-8

EXPOSE 8088

CMD [ "npm", "dev" ]
FROM node:latest

MAINTAINER xql279671394@163.com

ENV HTTP_PORT 8088

COPY . /app
WORKDIR /app

RUN npm --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist install

EXPOSE 8088

CMD ["npm", "start"]

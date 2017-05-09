FROM node:latest

MAINTAINER xql279671394@163.com

ENV HTTP_PORT 80

COPY . /app
WORKDIR /app

RUN npm --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist install

EXPOSE 80

CMD ["npm", "start"]

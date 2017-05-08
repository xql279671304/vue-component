FROM hub.c.163.com/public/nodejs:5.7.0

MAINTAINER xql279671394@163.com

COPY . /app
WORKDIR /app

RUN npm --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist install

EXPOSE 8088

CMD ["npm", "start"]

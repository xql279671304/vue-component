FROM nginx:latest

MAINTAINER xql279671394@163.com

ADD nginx.conf /etc/nginx/
ADD dist /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

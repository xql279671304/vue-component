FROM nginx:latest

ADD nginx.conf /etc/nginx/
ADD dist /usr/share/nginx/html/


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
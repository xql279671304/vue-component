FROM nginx:latest

ADD dist /etc/nginx/content/


EXPOSE 80 443

CMD ["/usr/sbin/nginx"]
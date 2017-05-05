FROM nginx:latest

ADD dist /etc/nginx/content/


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
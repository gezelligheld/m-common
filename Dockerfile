FROM nginx:1.24.0-alpine

COPY ./docs-dist /usr/share/nginx/html
COPY ./nginx/default.conf /usr/share/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

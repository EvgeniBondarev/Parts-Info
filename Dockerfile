# Используем официальный образ Nginx
FROM nginx:alpine

# Копируем наш HTML файл в каталог, который используется для веб-сервером
COPY index.html /usr/share/nginx/html/

# Порт, который будет слушать контейнер
EXPOSE 80

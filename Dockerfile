# Используем официальный образ Nginx
FROM nginx:alpine

# Устанавливаем рабочий каталог внутри контейнера
WORKDIR /usr/share/nginx/html

# Копируем все файлы проекта в каталог веб-сервера внутри контейнера
COPY . .

# Убираем стандартный конфиг Nginx (по желанию)
# COPY nginx.conf /etc/nginx/nginx.conf

# Порт, который будет слушать контейнер
EXPOSE 80

# Запускаем Nginx (в контейнере по умолчанию используется команда CMD)
CMD ["nginx", "-g", "daemon off;"]

# Указываем базовый образ с Node.js
FROM node:18-alpine AS build

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код приложения в контейнер
COPY . .

# Собираем приложение для продакшена
RUN npm run build

# ---- Фаза для запуска приложения ----

# Используем более легкий образ для запуска
FROM nginx:alpine

# Копируем собранное приложение в папку, из которой Nginx будет раздавать файлы
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем файл конфигурации Nginx (опционально)
# Если у вас есть кастомный nginx.conf, раскомментируйте строку ниже:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Указываем порт, который будет использовать контейнер
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
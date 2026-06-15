#!/bin/sh
# Цей скрипт запускається автоматично при старті контейнера Nginx

echo "Replacing environment variables in built JS files..."

# Шукаємо всі .js файли і замінюємо плейсхолдери на значення з .env файлу сервера
find /usr/share/nginx/html/assets -type f -name "*.js" -exec sed -i "s|__VITE_FIREBASE_API_KEY_PLACEHOLDER__|${VITE_FIREBASE_API_KEY}|g" {} +
find /usr/share/nginx/html/assets -type f -name "*.js" -exec sed -i "s|__VITE_FIREBASE_AUTH_DOMAIN_PLACEHOLDER__|${VITE_FIREBASE_AUTH_DOMAIN}|g" {} +
find /usr/share/nginx/html/assets -type f -name "*.js" -exec sed -i "s|__VITE_FIREBASE_PROJECT_ID_PLACEHOLDER__|${VITE_FIREBASE_PROJECT_ID}|g" {} +
find /usr/share/nginx/html/assets -type f -name "*.js" -exec sed -i "s|__VITE_FIREBASE_STORAGE_BUCKET_PLACEHOLDER__|${VITE_FIREBASE_STORAGE_BUCKET}|g" {} +
find /usr/share/nginx/html/assets -type f -name "*.js" -exec sed -i "s|__VITE_FIREBASE_MESSAGING_SENDER_ID_PLACEHOLDER__|${VITE_FIREBASE_MESSAGING_SENDER_ID}|g" {} +
find /usr/share/nginx/html/assets -type f -name "*.js" -exec sed -i "s|__VITE_FIREBASE_APP_ID_PLACEHOLDER__|${VITE_FIREBASE_APP_ID}|g" {} +
find /usr/share/nginx/html/assets -type f -name "*.js" -exec sed -i "s|__VITE_API_URL_PLACEHOLDER__|${VITE_API_URL}|g" {} +

echo "All variables have been replaced successfully."
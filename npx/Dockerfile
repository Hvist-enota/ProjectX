# ==========================================
# Етап 1: Збірка проекту
# ==========================================
FROM node:24-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# Вказуємо тимчасові плейсхолдери для Vite
ENV VITE_FIREBASE_API_KEY=__VITE_FIREBASE_API_KEY_PLACEHOLDER__
ENV VITE_FIREBASE_AUTH_DOMAIN=__VITE_FIREBASE_AUTH_DOMAIN_PLACEHOLDER__
ENV VITE_FIREBASE_PROJECT_ID=__VITE_FIREBASE_PROJECT_ID_PLACEHOLDER__
ENV VITE_FIREBASE_STORAGE_BUCKET=__VITE_FIREBASE_STORAGE_BUCKET_PLACEHOLDER__
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=__VITE_FIREBASE_MESSAGING_SENDER_ID_PLACEHOLDER__
ENV VITE_FIREBASE_APP_ID=__VITE_FIREBASE_APP_ID_PLACEHOLDER__
ENV VITE_API_URL=__VITE_API_URL_PLACEHOLDER__

# Vite "запече" ці плейсхолдери у фінальні файли
RUN npm run build

# ==========================================
# Етап 2: Продакшен сервер
# ==========================================
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копіюємо наш скрипт підміни і робимо його виконуваним
COPY replace-env.sh /docker-entrypoint.d/40-replace-env.sh
RUN chmod +x /docker-entrypoint.d/40-replace-env.sh

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

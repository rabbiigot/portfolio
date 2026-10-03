# Portfolio web — Vite/React build served by nginx, which also proxies /api
# to the api service so the browser talks to one origin.
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Leave VITE_API_URL unset so the client calls same-origin /api (nginx proxies
# it to the api container).
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

# Stage 1: build
FROM node:lts-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY src/ src/
COPY style.css rollup.config.js ./
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:alpine AS server
WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist/ dist/
COPY examples/ examples/
COPY style.css ./

EXPOSE 80

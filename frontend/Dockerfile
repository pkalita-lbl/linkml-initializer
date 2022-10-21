FROM node:16-alpine as builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . . 

RUN npm run build

FROM nginx:1.23.2-alpine as runner
COPY --from=builder /app/dist/ /usr/share/nginx/html
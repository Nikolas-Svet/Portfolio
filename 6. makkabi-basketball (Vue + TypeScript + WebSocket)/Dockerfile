FROM node:22 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM joseluisq/static-web-server:2.14.1-alpine
COPY --from=builder /app/dist /public

EXPOSE 8080
CMD ["--root", "/public", "--host", "0.0.0.0", "--port", "8080", "--page404", "/public/index.html"]





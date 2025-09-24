FROM node:18-alpine

WORKDIR /app

COPY ./services/courses-service ./

RUN yarn install

RUN yarn build

EXPOSE ${PORT_COURSES}

CMD ["node", "dist/server.js"]

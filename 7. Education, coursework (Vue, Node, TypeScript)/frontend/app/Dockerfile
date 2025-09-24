# ---------- build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:20-alpine AS runner
WORKDIR /app

RUN yarn global add serve

COPY --from=builder /app/dist ./dist

ENV PORT_FRONTEND=8080
EXPOSE 8080

CMD sh -c "serve -s dist -l ${PORT_FRONTEND}"

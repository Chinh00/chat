FROM node:lts-alpine AS node-build

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn run build

EXPOSE 80
EXPOSE 443

CMD ["yarn", "preview"]
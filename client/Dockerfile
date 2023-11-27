FROM node:lts-alpine

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn run build

EXPOSE 8080

CMD ["yarn", "preview"]

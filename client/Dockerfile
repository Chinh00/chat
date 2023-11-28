FROM node:lts-alpine

WORKDIR /app


COPY . .
RUN yarn install
RUN yarn run build



EXPOSE 8080

#CMD ["yarn", "preview"]
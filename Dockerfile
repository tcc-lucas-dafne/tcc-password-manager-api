FROM node:latest

COPY . /app

WORKDIR /app

CMD ["sh","-c", "yarn install && yarn start"]
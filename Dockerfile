FROM node:latest

COPY . /app

WORKDIR /app

CMD ["sh","-c", "npm install && npm start"]

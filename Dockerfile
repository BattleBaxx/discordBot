FROM node:lts-buster-slim

WORKDIR /discordBot

COPY package*.json ./

RUN npm install

COPY ./src ./src

CMD npm run start
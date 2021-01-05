FROM node:lts-buster-slim

WORKDIR /discordBot

COPY package*.json ./

RUN npm install

COPY . .

CMD npm run start
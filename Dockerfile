FROM node:lts-buster-slim

WORKDIR /discordBot

COPY package*.json ./

RUN npm install --quiet

COPY . .

CMD npm run start
FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

ARG APP_ENV=production
ENV NODE_ENV $APP_ENV

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]

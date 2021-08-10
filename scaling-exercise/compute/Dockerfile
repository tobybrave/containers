FROM node:10

WORKDIR /usr/app

COPY . .

RUN npm ci

EXPOSE 3000

CMD ["node", "./index.js"] 

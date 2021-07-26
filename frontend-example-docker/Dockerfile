FROM ubuntu AS build
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt install -y nodejs

WORKDIR /app
COPY package* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:10-alpine
RUN npm install -g serve
EXPOSE 5000

COPY --from=build app/dist/ ./dist
CMD ["serve", "-s", "-l", "5000", "dist"]

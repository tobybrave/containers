FROM ubuntu
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt-get install -y nodejs

WORKDIR /app
COPY package* ./
RUN npm ci
COPY . .
EXPOSE 5000

CMD ["npm", "start"]

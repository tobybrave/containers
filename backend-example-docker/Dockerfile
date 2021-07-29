FROM ubuntu

RUN apt update && apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt install -y nodejs

WORKDIR /app
COPY package* ./
RUN npm ci

COPY . .
CMD ["npm", "start"]


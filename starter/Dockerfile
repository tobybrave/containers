FROM ubuntu:latest

WORKDIR /usr/app
COPY local.txt .
RUN touch example.txt
RUN apt-get update && apt-get install -y curl
RUN curl http://example.com/index.html > example.txt


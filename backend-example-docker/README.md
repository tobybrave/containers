# backend-example-docker

dockerfile for https://github.com/docker-hy/backend-example-docker

### build image with
`docker build -t <name> .`

### run container with
`docker run --mount type=mount,src="$(pwd)"/logs.txt,dst=/app/logs.txt -p 8000:8000 <name>`

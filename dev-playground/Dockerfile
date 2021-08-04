FROM ubuntu:18.04

RUN apt update && apt install -y curl \ 
  apt-transport-https \
  ca-certificates \
  gnupg \
  lsb-release \
  software-properties-common

# nodesource
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash

# docker source
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
RUN add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
 
# docker-compose source
RUN curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
RUN chmod +x /usr/local/bin/docker-compose 

# k3d source
RUN curl -s https://raw.githubusercontent.com/rancher/k3d/main/install.sh | bash

# kubectl source
RUN curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
RUN echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | tee /etc/apt/sources.list.d/kubernetes.list

# heroku
RUN curl https://cli-assets.heroku.com/install.sh | sh

RUN apt update && apt-get install -y git \ 
  vim wget ssh \
  nodejs python-is-python3 \
  docker-ce docker-ce-cli containerd.io \
  kubectl && \
  apt-cache policy docker-ce && \
  apt install docker-ce

WORKDIR /playground


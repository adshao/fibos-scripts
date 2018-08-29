FROM ubuntu:18.04

RUN apt-get update && apt-get install -y \
    curl \
    sudo \
    libssl1.0.0
RUN curl -s https://fibos.io/download/installer.sh | sh

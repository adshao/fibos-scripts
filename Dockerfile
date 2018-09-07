FROM ubuntu:18.04 as builder
RUN apt update \
    && apt install -y curl sudo \
    && curl -s https://fibos.io/download/installer.sh | sh

FROM ubuntu:18.04
RUN apt update \
    && apt install -y libssl1.0.0 \
    && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/bin/fibos /usr/local/bin/fibos
CMD ["/usr/local/bin/fibos"]

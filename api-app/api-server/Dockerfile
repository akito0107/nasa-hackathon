FROM golang:1.6.0-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY main /usr/src/app
CMD ["./main", "-redis", "redis:6379"]

#!/bin/sh

go get github.com/garyburd/redigo/redis
GOOS=linux GOARCH=amd64 go build -o main

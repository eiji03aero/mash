#!/bin/bash

cmd="${1:-def}"

if [ $cmd = "def" ]; then
  echo no command specified

elif [ $cmd = "await-nc" ]; then
  host="${2}"
  port="${3}"
  while ! nc -z $host $port; do
    echo waiting for $host:$port ...
    sleep 3s
  done
  echo done waiting $host:$port

elif [ $cmd = "await-curl" ]; then
  host="${2}"
  port="${3}"
  while ! curl -sf -o /dev/null $host:$port; do
    echo waiting for $host:$port ...
    sleep 3s
  done
  echo done waiting $host:$port
fi

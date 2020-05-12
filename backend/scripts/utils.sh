#!/bin/bash

cmd="${1:-def}"

if [ $cmd = "def" ]; then
  echo no command specified

elif [ $cmd = "await-address" ]; then
  host="${2}"
  port="${3}"
  while ! nc -z $host $port; do
    echo waiting for $host:$port ...
    sleep 3s
  done
fi

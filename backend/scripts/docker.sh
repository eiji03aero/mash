#!/bin/bash

cmd="${1:-def}"

script_dir=$(cd $(dirname $0); pwd)
root_dir=$(dirname $script_dir)

if [ $cmd = "def" ]; then
  echo no command specified
  exit 1

elif [ $cmd = "publish:go-dev" ]; then
  tag="eiji03aero/mash-go-dev:latest"
  cd $root_dir

  docker build \
    -t $tag \
    -f ./docker/Dockerfile.go-dev \
    .

  docker push $tag

fi

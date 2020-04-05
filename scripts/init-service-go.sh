#!/bin/bash

service_name="$1"

docker_image="mash-build-go-service:latest"
root_dir=$(cd $(dirname $0); cd ../; pwd)
module_path="$service_name"
service_path="$root_dir/services/$service_name"
service_template_path="$root_dir/templates/go"

if [ $# -lt 1 ]; then
  echo "arguments not enough"
  echo "usage: ./scripts/init-service-node.sh [app_name]"
  exit 1
fi

if [ -e $service_path ]; then
  echo "service already exists: $service_path"
  exit 1
fi

cp -r templates/go $service_path

docker build -t $docker_image -f ./docker/Dockerfile.go-service .

docker run --rm \
  -w /app \
  -v $service_path:/app \
  $docker_image \
  /bin/bash -c "mskit init . --name $service_name"

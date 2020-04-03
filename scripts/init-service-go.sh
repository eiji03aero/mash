#!/bin/bash

service_name="$1"

go_image="golang:1.13.7-buster"
root_dir=$(cd $(dirname $0); cd ../; pwd)
module_path="github.com/eiji03aero/mash/services/$service_name"
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

commands=$(cat <<- EOF
go mod init $module_path
EOF
)

cp -r templates/go $service_path

docker run --rm \
  -w /app \
  -v $service_path:/app \
  $go_image \
  /bin/bash -c "$commands"

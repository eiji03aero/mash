#!/bin/bash

script_dir=$(cd $(dirname $0); pwd)
root_dir=$(dirname $script_dir)

cd $root_dir
./docker-compose.sh up -d
./scripts/utils.sh await-address 127.0.0.1 5672

cd $root_dir/e2e
echo Starting test
./docker-compose.sh

cat << EOF
Test done!!
status=$?
EOF

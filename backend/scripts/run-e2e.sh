#!/bin/bash

script_dir=$(cd $(dirname $0); pwd)
root_dir=$(dirname $script_dir)

cd $root_dir
./docker-compose.sh build
(./docker-compose.sh up &)
./scripts/utils.sh await-curl localhost 4000

cd $root_dir/e2e
echo Starting test
./docker-compose.sh

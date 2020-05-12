#!/bin/bash

cmd=${1:-test}
project_name="mash-backend-e2e"
container_name="workspace"

execute-docker-compose () {
  docker-compose \
    -p $project_name \
    -f 'docker-compose.yml' \
    $@
}

stop-docker-compose () {
  execute-docker-compose stop
}

if [ $cmd = 'test' ] && [ $# -le 1 ]; then
  execute-docker-compose up \
    --exit-code-from $container_name

elif [ $cmd = 'bash' ]; then
  execute-docker-compose run --rm $container_name /bin/bash
else
  execute-docker-compose $@
fi

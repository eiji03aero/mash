#!/bin/bash

COMMAND=${1:-up}

execute-docker-compose () {
  docker-compose \
    -f docker-compose.yml \
    -f docker-compose.dev.yml \
    $@
}

function stop-docker-compose () {
  execute_docker_sync stop
  execute_docker_compose stop
}

if [ $COMMAND = 'up' ] && [ $# -le 1 ]; then
  docker-sync start
  execute-docker-compose run mash bash
  stop-docker-compose
else
  execute-docker-compose $@
fi

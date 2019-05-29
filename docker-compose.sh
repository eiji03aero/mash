#!/bin/bash

COMMAND=${1:-up}

execute-docker-compose () {
  docker-compose \
    -f docker-compose.yml \
    -f docker-compose.dev.yml \
    $@
}

function stop-docker-compose () {
  docker-sync stop
  execute-docker-compose stop
}

if [ $COMMAND = 'up' ] && [ $# -le 1 ]; then
  docker-sync start
  execute-docker-compose run mash bash
  stop-docker-compose
else
  execute-docker-compose $@
fi

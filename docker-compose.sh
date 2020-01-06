#!/bin/bash

COMMAND=${1:-up}

execute-docker-compose () {
  docker-compose \
    -f docker-compose.yml \
    -f docker-compose.dev.yml \
    $@
}

stop-docker-compose () {
  docker-sync stop
  execute-docker-compose stop
}

# Required to let plugins on editor work properly,
# otherwise local packages will not have symlinks properly
# and not to hoist typescript cuz tsuquyomi needs it on package's root
bootstrap () {
  docker-sync start
  execute-docker-compose build
  execute-docker-compose up -d

  echo "wait for containers to be ready"
  sleep 5s

  execute-docker-compose exec mash lerna bootstrap
  execute-docker-compose exec mash lerna link
  stop-docker-compose
}

clean () {
  stop-docker-compose
  docker-sync clean
  execute-docker-compose down --volumes
  docker volume rm c-mash-sync
}

if [ $COMMAND = 'up' ] && [ $# -le 1 ]; then
  docker-sync start
  execute-docker-compose up -d
  execute-docker-compose exec mash bash
  stop-docker-compose

elif [ $COMMAND = 'bash' ]; then
  execute-docker-compose exec mash bash

elif [ $COMMAND = 'init' ]; then
  bootstrap
  clean

elif [ $COMMAND = 'bootstrap' ]; then
  bootstrap

elif [ $COMMAND = 'clean' ]; then
  clean

else
  execute-docker-compose $@
fi

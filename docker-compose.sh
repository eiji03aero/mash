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
elif [ $COMMAND = 'bash-rm' ]; then
  execute-docker-compose exec rabbitmq bash
elif [ $COMMAND = 'bash-s-f' ]; then
  execute-docker-compose exec frontend-service bash
elif [ $COMMAND = 'bash-s-a' ]; then
  execute-docker-compose exec auth-service bash
elif [ $COMMAND = 'bash-s-fs' ]; then
  execute-docker-compose exec filesystem-service bash

elif [ $COMMAND = 'bootstrap' ]; then
  bootstrap

elif [ $COMMAND = 'clean' ]; then
  clean

else
  execute-docker-compose $@
fi

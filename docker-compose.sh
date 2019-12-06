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
  execute-docker-compose exec mash lerna clean --yes
  execute-docker-compose exec mash lerna bootstrap
  execute-docker-compose exec mash lerna link
}

clean () {
  docker-sync stop
  execute-docker-compose stop
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

elif [ $COMMAND = 'bootstrap' ]; then
  bootstrap

elif [ $COMMAND = 'clean' ]; then
  clean

else
  execute-docker-compose $@
fi

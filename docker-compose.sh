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
# otherwise tsuquyomi won't work
bootstrap () {
  docker-sync stop

  docker-compose run mash rm -rf node_modules
  docker-compose run mash rm -rf packages/mash/node_modules
  docker-compose run mash rm -rf packages/mash-common/node_modules
  docker-compose run mash rm -rf packages/mash-filesystem/node_modules

  docker-compose run mash yarn install
  docker-compose run mash lerna bootstrap
}

if [ $COMMAND = 'up' ] && [ $# -le 1 ]; then
  execute-docker-compose up -d
  docker-sync start
  execute-docker-compose exec mash bash
  stop-docker-compose

elif [ $COMMAND = 'bash' ]; then
  execute-docker-compose exec mash bash

elif [ $COMMAND = 'bootstrap' ]; then
  bootstrap

else
  execute-docker-compose $@
fi

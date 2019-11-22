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
bootstrap () {
  docker-compose run --rm mash /bin/bash -c "lerna clean --yes && lerna bootstrap && lerna link"
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

#!/bin/bash

COMMAND=${1:-up}

client_cname="mash-client"

execute-docker-compose () {
  docker-compose \
    -f ./docker-compose.yml \
    -f ./docker-compose.dev.yml \
    $@
}

execute-docker-sync () {
  docker-sync \
    $@ \
    -c ./docker-sync.yml
}

stop-docker-compose () {
  execute-docker-sync stop
  execute-docker-compose stop
}

# Required to let plugins on editor work properly,
# otherwise local packages will not have symlinks properly
# and not to hoist typescript cuz tsuquyomi needs it on package's root.
bootstrap () {
  execute-docker-sync start
  execute-docker-compose build
  execute-docker-compose up -d

  echo "wait for containers to be ready"
  sleep 5s

  execute-docker-compose exec mash lerna clean --yes
  execute-docker-compose exec mash lerna bootstrap
  execute-docker-compose exec mash lerna link
  stop-docker-compose
}

clean () {
  stop-docker-compose
  execute-docker-sync clean
  execute-docker-compose down --volumes
}

if [ $COMMAND = 'up' ] && [ $# -le 1 ]; then
  execute-docker-sync start
  execute-docker-compose up -d --remove-orphans
  execute-docker-compose exec $client_cname bash
  stop-docker-compose

elif [ $COMMAND = 'bash' ]; then
  execute-docker-compose exec $client_cname bash
elif [ $COMMAND = 'bash-m' ]; then
  execute-docker-compose exec -w /projects/client/packages/mash $client_cname bash
elif [ $COMMAND = 'bash-fs' ]; then
  execute-docker-compose exec -w /projects/client/packages/mash-filesystem $client_cname bash
elif [ $COMMAND = 'bash-c' ]; then
  execute-docker-compose exec -w /projects/client/packages/mash-common $client_cname bash
elif [ $COMMAND = 'bash-t' ]; then
  execute-docker-compose exec -w /projects/client/packages/mash-term $client_cname bash
elif [ $COMMAND = 'bash-w' ]; then
  execute-docker-compose exec -w /projects/client/packages/web $client_cname bash

elif [ $COMMAND = 'bootstrap' ]; then
  bootstrap

elif [ $COMMAND = 'clean' ]; then
  clean

elif [ $COMMAND = 'sync-reset' ]; then
  execute-docker-sync stop
  execute-docker-sync clean
  execute-docker-sync start

else
  execute-docker-compose $@
fi

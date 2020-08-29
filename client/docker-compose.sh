#!/bin/bash

project_name="mash-client"
cmd=${1:-up}

client_cname="mash-client"

execute-docker-compose () {
  docker-compose \
    -p $project_name \
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
}

# Expecting docker container is already up and running, to avoid filesystem mismatch
# caused by docker-sync's sync-delay.
init-package () {
  package_name=$1

  # Need to run without sync-container, since it bothers lerna to find
  # git root directory
  docker-compose \
    -p $project_name \
    -f ./docker-compose.yml \
    run --rm $client_cname \
    ./scripts/init-package.sh init-skelton $package_name

  execute-docker-compose exec $client_cname \
    ./scripts/init-package.sh install-dependencies $package_name
}

clean () {
  stop-docker-compose
  execute-docker-sync clean
  execute-docker-compose down --volumes
}

if [ $cmd = 'up' ] && [ $# -le 1 ]; then
  execute-docker-sync start
  execute-docker-compose up -d
  execute-docker-compose exec $client_cname bash
  stop-docker-compose

elif [ $cmd = 'bash' ]; then
  execute-docker-compose exec $client_cname bash
elif [ $cmd = 'bash-m' ]; then
  execute-docker-compose exec -w /projects/client/packages/mash $client_cname bash
elif [ $cmd = 'bash-fs' ]; then
  execute-docker-compose exec -w /projects/client/packages/mash-filesystem $client_cname bash
elif [ $cmd = 'bash-c' ]; then
  execute-docker-compose exec -w /projects/client/packages/mash-common $client_cname bash
elif [ $cmd = 'bash-t' ]; then
  execute-docker-compose exec -w /projects/client/packages/mash-term $client_cname bash
elif [ $cmd = 'bash-w' ]; then
  execute-docker-compose exec -w /projects/client/packages/web $client_cname bash
elif [ $cmd = 'bash-e' ]; then
  execute-docker-compose exec -w /projects/client/packages/mash-editor $client_cname bash

elif [ $cmd = 'bootstrap' ]; then
  bootstrap

elif [ $cmd = 'init-package' ]; then
  init-package $2

elif [ $cmd = 'clean' ]; then
  clean

elif [ $cmd = 'sync-reset' ]; then
  execute-docker-sync stop
  execute-docker-sync clean
  execute-docker-sync start

else
  execute-docker-compose $@
fi

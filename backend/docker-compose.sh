#!/bin/bash

COMMAND=${1:-up}

frontend_cname="mash-s-frontend"
rabbitmq_cname="mash-rabbitmq"

execute-docker-compose () {
  docker-compose \
    -f ./docker-compose.yml \
    $@
}

stop-docker-compose () {
  execute-docker-compose stop
}

if [ $COMMAND = 'up' ] && [ $# -le 1 ]; then
  execute-docker-compose up
  stop-docker-compose

elif [ $COMMAND = 'bash-f' ]; then
  execute-docker-compose exec $frontend_cname bash
elif [ $COMMAND = 'bash-rm' ]; then
  execute-docker-compose exec $rabbitmq_cname bash

else
  execute-docker-compose $@
fi

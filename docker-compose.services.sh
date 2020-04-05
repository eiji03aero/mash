#!/bin/bash

COMMAND=${1:-up}

frontend_cname="frontend"
rabbitmq_cname="rabbitmq"

execute-docker-compose () {
  docker-compose \
    -f ./docker/services/docker-compose.yml \
    $@
}

# execute-docker-sync () {
#   docker-sync \
#     $@
# }

stop-docker-compose () {
  # execute-docker-sync stop
  execute-docker-compose stop
}

if [ $COMMAND = 'up' ] && [ $# -le 1 ]; then
  # execute-docker-sync start
  execute-docker-compose up -d
  execute-docker-compose exec $frontend_cname bash
  stop-docker-compose

elif [ $COMMAND = 'bash-f' ]; then
  execute-docker-compose exec $frontend_cname bash
elif [ $COMMAND = 'bash-rm' ]; then
  execute-docker-compose exec $rabbitmq_cname bash

else
  execute-docker-compose $@
fi

#!/bin/bash

COMMAND=${1:-up}

frontend_cname="mash-s-frontend"
auth_cname="mash-s-auth"
authquery_cname="mash-s-authquery"
rabbitmq_cname="mash-rabbitmq"

services=$(cat << EOF
$frontend_cname
$auth_cname
$authquery_cname
EOF
)

execute-docker-compose () {
  docker-compose \
    -f ./docker-compose.yml \
    $@
}

stop-docker-compose () {
  execute-docker-compose stop
}

execute-all-services () {
  for service in $services; do
    execute-docker-compose exec $service $@
  done
}

if [ $COMMAND = 'up' ] && [ $# -le 1 ]; then
  execute-docker-compose up
  stop-docker-compose

elif [ $COMMAND = 'bash-f' ]; then
  execute-docker-compose exec $frontend_cname bash
elif [ $COMMAND = 'bash-a' ]; then
  execute-docker-compose exec $auth_cname bash
elif [ $COMMAND = 'bash-aq' ]; then
  execute-docker-compose exec $authquery_cname bash
elif [ $COMMAND = 'bash-rm' ]; then
  execute-docker-compose exec $rabbitmq_cname bash

elif [ $COMMAND = 'clean-db' ]; then
  execute-docker-compose exec mash-s-auth-mongo mongo --eval \
    'db.getSiblingDB("mskit").events.remove({});'
  execute-docker-compose exec mash-s-authquery-mongo mongo --eval \
    'db.getSiblingDB("repository").users.remove({});'

elif [ $COMMAND = 'update-mskit' ]; then
  execute-all-services go get -u github.com/eiji03aero/mskit
  execute-all-services go install github.com/eiji03aero/mskit/cmd/mskit

else
  execute-docker-compose $@
fi

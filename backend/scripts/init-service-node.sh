#!/bin/bash

service_name="$1"
root_dir=$(cd $(dirname $0); cd ../; pwd)
service_path="$root_dir/services/$service_name"
service_template_path="$root_dir/templates/node"

if [ $# -lt 1 ]; then
  echo "arguments not enough"
  echo "usage: ./scripts/init-service-node.sh [app_name]"
  exit 1
fi

if [ -e $service_path ]; then
  echo "service already exists: $service_path"
  exit 1
fi

file_names=$(cat <<- EOF
.eslintrc.json
jest.config.js
tsconfig.eslint.json
tsconfig.json
EOF
)

dev_lib_names=$(cat <<- EOF
@types/jest
@types/node
@types/express
@types/amqplib
@types/dotenv
@typescript-eslint/eslint-plugin
@typescript-eslint/parser
eslint
jest
ts-jest
ts-node
typescript
EOF
)

lib_names=$(cat <<- EOF
express
amqplib
dotenv
EOF
)


mkdir $service_path
mkdir $service_path/__tests__
mkdir $service_path/src

for fname in $file_names; do
  cp "$service_template_path/$fname" "$service_path"
done

cd $service_path
yarn init -y
yarn add -D $dev_lib_names
yarn add $lib_names

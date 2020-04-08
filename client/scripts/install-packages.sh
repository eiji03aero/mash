#!/bin/bash

dep_type="$1"
filter_glob="$2"
package_names=${@:3}
args=""

if [ $# -lt 3 ]; then
  echo "not enough arguments"
  echo "usage: installpackages.sh [dev | prod] [filter_glob] [...package names]"
  exit 1
fi

if [ $dep_type = "dev" ]; then
  dep_type="-D"
elif [ $dep_type = "prod" ]; then
  dep_type=""
else
  echo "first argument has to be either [dev | prod]"
  exit 1
fi

for pname in $package_names; do
  npx lerna add $dep_type $pname --scope=$filter_glob
done

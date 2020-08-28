#!/bin/bash

if [ $# -lt 1 ]; then
  echo "arguments not enough"
  echo "usabe: init-package.sh [package_name]"
  exit 1
fi

cmd="$1"
package_name="$2"

root_dir=$(cd $(dirname $0); cd ../; pwd)
package_path="$root_dir/packages/$package_name"
template_package_path="$root_dir/templates/ts"

lib_names=$(cat <<- EOF
@types/jest
@types/node
@typescript-eslint/eslint-plugin
@typescript-eslint/parser
eslint
jest
ts-jest
ts-node
typescript
EOF
)

if [ $cmd = "init-skelton" ]; then
  yarn lerna create $package_name --yes

  for fname in $(ls -A $template_package_path); do
    cp "$template_package_path/$fname" "$package_path/"
  done

elif [ $cmd = "install-dependencies" ]; then
  for lname in $lib_names; do
    yarn lerna add -D $lname --scope=$package_name
  done
fi

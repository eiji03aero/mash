#!/bin/bash

package_name="$1"
package_path="packages/$package_name"
src_package_path="packages/mash"

file_names=$(cat <<- EOF
.eslintrc.json
jest.config.js
tsconfig.eslint.json
tsconfig.json
EOF
)

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

if [ $# -lt 1 ]; then
  echo "arguments not enough"
  exit 1
fi

lerna create $package_name --yes

for fname in $file_names; do
  cp "$src_package_path/$fname" "$package_path"
done

for lname in $lib_names; do
  lerna add -D $lname --scope=$package_name
done

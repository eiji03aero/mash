#!/bin/bash

# ./node_modules/.bin/lerna exec --stream --concurrency 1 -- yarn upgrade --latest

lib_names=$(cat <<- EOF
@typesciprt-eslint/eslint-plugin
@typesciprt-eslint/parser
@eslint
EOF
)

for name in $lib_names; do
  ./node_modules/.bin/lerna exec --stream --concurrency 1 -- yarn upgrade $name --latest
done

yarn lerna link

#! /usr/bin/env bash

main(){
  echo "Installing bit.dev"
  npm config set @bit:registry https://node.bit.dev
  npm run build
}

main

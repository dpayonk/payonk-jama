#! /usr/bin/env bash


main(){
  npm config set @bit:registry https://node.bit.dev
  echo "Installing bit.dev"
  npm install
}


main

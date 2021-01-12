#! /usr/bin/env bash


main(){
  script/update_appspec.sh
  git push github main
}


main

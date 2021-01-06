#!/usr/bin/env bash

main(){
  doctl apps update 8ba6c75e-761a-4faa-adda-224d47427b7c --spec appspec.yml
}

main
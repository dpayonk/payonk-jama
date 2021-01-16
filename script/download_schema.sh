#!/usr/bin/env bash

main(){
  echo "Downloading hasura schema to schema.json"
  apollo schema:download --endpoint https://api.whealthy.us/v1/graphql --header "X-Hasura-Admin-Secret: $HASURA_SECRET"

}

main

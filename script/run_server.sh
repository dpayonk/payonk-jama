#!/usr/bin/env bash

main(){
    uvicorn --host 0.0.0.0 payonk.api:app --port 8080
}

main

#!/bin/bash

FILE=./local.Dockerfile
TAG=local
IMAGE=matryx-alpha-explorer
REPO=441665557124.dkr.ecr.us-west-1.amazonaws.com

cp $FILE ../Dockerfile

cd ..

# Build docker
docker build --no-cache -t $IMAGE:$TAG .
# Tag docker
docker tag $IMAGE:$TAG $REPO/$IMAGE:$TAG
# Upload docker to secured repo
docker push $REPO/$IMAGE:$TAG

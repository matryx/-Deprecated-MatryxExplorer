#!/bin/bash

TAG=dev

FILE=./dockerization/Dockerfile
IMAGE=matryx-alpha-explorer
REPO=441665557124.dkr.ecr.us-west-1.amazonaws.com

# Set the context to project root
cd ..

# Build docker
docker build -f $FILE --no-cache -t $IMAGE:$TAG .
# Tag docker
docker tag $IMAGE:$TAG $REPO/$IMAGE:$TAG
# Upload docker to secured repo
docker push $REPO/$IMAGE:$TAG

cp ./prodDockerfile ../Dockerfile

cd ..

# Build docker
docker build --no-cache -t matryx-alpha-explorer:prod .
# Tag docker
docker tag matryx-alpha-explorer:prod 441665557124.dkr.ecr.us-west-1.amazonaws.com/matryx-alpha-explorer:prod
# Upload docker to secured repo
docker push 441665557124.dkr.ecr.us-west-1.amazonaws.com/matryx-alpha-explorer:prod

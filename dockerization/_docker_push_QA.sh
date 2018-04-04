cp ./qaDockerfile ../Dockerfile
cd ..

# Build docker
docker build --no-cache -t matryx-alpha-explorer:qa .
# Tag docker
docker tag matryx-alpha-explorer:qa 441665557124.dkr.ecr.us-west-1.amazonaws.com/matryx-alpha-explorer:qa
# Upload docker to secured repo
docker push 441665557124.dkr.ecr.us-west-1.amazonaws.com/matryx-alpha-explorer:qa

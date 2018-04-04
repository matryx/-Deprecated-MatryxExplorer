cp ./devDockerfile ../Dockerfile

cd ..

# Build docker
docker build --no-cache -t matryx-alpha-explorer:latest .
# Tag docker
docker tag matryx-alpha-explorer:latest 441665557124.dkr.ecr.us-west-1.amazonaws.com/matryx-alpha-explorer:latest
# Upload docker to secured repo
docker push 441665557124.dkr.ecr.us-west-1.amazonaws.com/matryx-alpha-explorer:latest

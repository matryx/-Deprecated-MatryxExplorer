docker build -t matryx-alpha-explorer .

docker tag matryx-alpha-explorer:latest 441665557124.dkr.ecr.us-west-1.amazonaws.com/matryx-alpha-explorer:latest

docker push 441665557124.dkr.ecr.us-west-1.amazonaws.com/matryx-alpha-explorer:latest
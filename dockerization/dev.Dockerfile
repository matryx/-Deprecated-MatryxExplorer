FROM node:alpine

RUN apk update && apk upgrade && \
	apk add --no-cache git
# Other packages: bash nano

ARG env=develop

ENV NODE_ENV=$env

# Create app directory
WORKDIR /usr/src/app

COPY . .

RUN yarn install

EXPOSE 3000 4002 5002 8081

CMD ["npm","start"]

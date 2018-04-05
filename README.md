# MatryxExplorer
### An open-source NodeJS API to easily read the Matryx Platform with full IPFS integration
 ![logo](https://github.com/matryx/matryx-alpha-source/blob/master/assets/Matryx-Logo-Black-1600px.png)
An open-source node.js api to read the MatryxPlatform to be consumed by anyone creating Matryx interfaces.

[![npm_Version](https://img.shields.io/badge/npm-5.7.1-brightgreen.svg)](http://npmjs.com)


[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)


# Running the API

##To run the API, downloaded the dependencies

```
npm install
```
## DEV: Serve the API with hot reload at localhost:3000

```
npm run dev
```

## PROD: Service the API in forever mode to restart if fails

```
npm start
```

### PROD: Run the PROD as a background process

```
nohup npm start &
```

Hold down ‘control’ and press ‘A’ then ‘D’



## Launching MatryxExplorer on an AWS EC2 instance (WIP: Single deploy Dockerization)
1. SSH into your AWS instance

2. ```sudo yum update```

3. ```sudo yum install git```

4. Install node and npm

 ```sudo yum install nodejs npm --enablerepo=epel```
sudo npm -g install npm
5. Install go
```sudo yum install go```

6.``` yum install ipfs```
7. ```cd ipfs/bin/```
8. ```./ipfs init```
9.




git clone https://github.com/matryx/MatryxExplorer
cd MatryxExplorer
npm install
nohup npm start &
Hold down ‘control’ and press ‘A’ then ‘D’
Now it is running the background

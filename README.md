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
1. SSH into your AWS instance + configure your AWS security to accept HTTP port 80

2. ```sudo yum update```

3. ```sudo yum install git```

4. Install node and npm

```sudo yum install nodejs npm --enablerepo=epel```
```sudo npm -g install npm```
5. Install go
```sudo yum install go```
6.
```export PATH=$PATH:/usr/local/go/bin
export PATH=$PATH:$GOPATH/bin
go get -u -d github.com/ipfs/go-ipfs
cd go/src/github.com/ipfs/go-ipfs
make install
```
7.```cd ~/go/bin```
8. ```./ipfs init```

The output will look like this:
[ec2-user@ip-172-31-19-210 bin]$ ./ipfs init
initializing IPFS node at /home/ec2-user/.ipfs
generating 2048-bit RSA keypair...done
peer identity: QmNto2pqQGcjzTX7feseTe6ytEmTWpMotbAQtgFpg9eaqH
to get started, enter:

	ipfs cat /ipfs/QmS4ustL54uo8FzR9455qaxZwuMiUhyvMcX9Ba8nUH4uVv/readme

Copy this for later-
The `QmS4ustL54uo8FzR9455qaxZwuMiUhyvMcX9Ba8nUH4uVv` hash is your peer identity.

9. Change the config to add a websocket at port 9999
```./ipfs config --json Addresses '{ "API": "/ip4/127.0.0.1/tcp/5001", "Announce": [], "Gateway": "/ip4/127.0.0.1/tcp/8080", "NoAnnounce": [], "Swarm": [ "/ip4/0.0.0.0/tcp/4001", "/ip6/::/tcp/4001", "/ip4/127.0.0.1/tcp/9999/ws" ]}'```

You can look at your IPFS config by typing
```ipfs config show```

Look at the 'Addresses' portion under 'Swarm'

It should look like:

"Addresses": {
  "API": "/ip4/127.0.0.1/tcp/5001",
  "Announce": [],
  "Gateway": "/ip4/127.0.0.1/tcp/8080",
  "NoAnnounce": [],
  "Swarm": [
    "/ip4/0.0.0.0/tcp/4001",
    "/ip6/::/tcp/4001",
    "/ip4/127.0.0.1/tcp/9999/ws"
  ]


9. ```nohup ./ipfs daemon &```
Hold down ‘control’ and press ‘A’ then ‘D’
(this will boot you out of your EC2, go ahead and shell back in)

10. Check to make sure it is running in the background still
```ps -eaf|grep "ipfs"```

12: Clone and Run the MatryxExplorer
```git clone https://github.com/matryx/MatryxExplorer
cd MatryxExplorer
npm install```

Place your peer identity from above (example: QmS4ustL54uo8FzR9455qaxZwuMiUhyvMcX9Ba8nUH4uVv) in the .env file of Matryx Explorer
Now you need to replace the end of the 'IPFS_DAEMON_PEER_ID' .env variable for MatryxExplorer to use this.

Now run the app in the background

```nohup npm start &```
Then Hold down ‘control’ and press ‘A’ then ‘D’
(this will boot you out of your EC2, go ahead and shell back in)

13. Now see if the process is Running
```ps -A | grep "node"```

You should see it running like so with the first number being your processID:

[ec2-user@ip-172-31-19-210 ~]$ ps -A | grep "node"
17156 ?        00:00:00 node
17552 ?        00:00:01 node <defunct>

14. To follow the logs of the process
tail -f /proc/<processID>/fd/1

It will be running now

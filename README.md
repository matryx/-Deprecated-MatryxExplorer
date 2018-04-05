
# MatryxExplorer
### An open-source NodeJS API to easily read the Matryx Platform with full IPFS integration.

[![logo](https://github.com/matryx/matryx-alpha-source/blob/master/assets/Matryx-Logo-Black-1600px.png)](http://matryx.ai)
An open-source node.js api to read the MatryxPlatform and interact with IPFS to be consumed by anyone creating Matryx interfaces.


[![BuildStatus](https://travis-ci.org/matryx/MatryxExplorer.svg?branch=master)](https://travis-ci.org/matryx/MatryxExplorer)

[![npm_Version](https://img.shields.io/badge/npm-5.7.1-brightgreen.svg)](http://npmjs.com)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
### Check out our full documentation at matryx.readthedocs.io


# Running the API

## To run the API, downloaded the dependencies

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

### PROD: Run PROD as a background process

```
nohup npm start &
```

Hold down ‘control’ and press ‘A’ then ‘D’



## Launching MatryxExplorer on an AWS EC2 instance (WIP: Single deploy Dockerization)
1. SSH into your AWS instance + configure your AWS security to accept HTTP port 80

**2. Update your EC2 instance**
 ```sudo yum update```

**3. Install Git**  
* ```sudo yum install git```

**4. Install node and npm**
* ```sudo yum install nodejs npm --enablerepo=epel```
* ```sudo npm -g install npm```

**5. Install go**
* ```sudo yum install go```

**6. Get and Install IPFS**
```export PATH=$PATH:/usr/local/go/bin
export PATH=$PATH:$GOPATH/bin
go get -u -d github.com/ipfs/go-ipfs
cd go/src/github.com/ipfs/go-ipfs
make install
```
*7. Go to the Go bin and initialize IPFS**
* ```cd ~/go/bin```
*  ```./ipfs init```

The output will look like this:
```[ec2-user@ip-172-31-19-210 bin]$ ./ipfs init
initializing IPFS node at /home/ec2-user/.ipfs
generating 2048-bit RSA keypair...done
peer identity: QmNto2pqQGcjzTX7feseTe6ytEmTWpMotbAQtgFpg9eaqH
to get started, enter:

	ipfs cat /ipfs/QmS4ustL54uo8FzR9455qaxZwuMiUhyvMcX9Ba8nUH4uVv/readme
```
Copy this hash for later-
The `QmS4ustL54uo8FzR9455qaxZwuMiUhyvMcX9Ba8nUH4uVv` hash is your IPFS peer identity.

**9. Change the config to add a websocket at port 9999**
* ```./ipfs config --json Addresses '{ "API": "/ip4/127.0.0.1/tcp/5001", "Announce": [], "Gateway": "/ip4/127.0.0.1/tcp/8080", "NoAnnounce": [], "Swarm": [ "/ip4/0.0.0.0/tcp/4001", "/ip6/::/tcp/4001", "/ip4/127.0.0.1/tcp/9999/ws" ]}'```

You can look at your IPFS config by typing
```ipfs config show```

Look at the 'Addresses' portion under 'Swarm'

It should look like:
```
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
  ```


**10. Run the IPFS Daemon**
 ```nohup ./ipfs daemon &```
Hold down ‘control’ and press ‘A’ then ‘D’
(this will boot you out of your EC2, go ahead and shell back in)

**11. Check to make sure it is running in the background still**
```ps -eaf|grep "ipfs"```

**12: Clone and Run the MatryxExplorer**
```git clone https://github.com/matryx/MatryxExplorer
cd MatryxExplorer
npm install
```
**13. Swap out your PeerID in the .env file**
Place your peer identity from above (example: QmS4ustL54uo8FzR9455qaxZwuMiUhyvMcX9Ba8nUH4uVv) in the .env file of Matryx Explorer
Now you need to replace the end of the 'IPFS_DAEMON_PEER_ID' .env variable for MatryxExplorer to use this.

**14. Run the app in the background**
```nohup npm start &```
Then Hold down ‘control’ and press ‘A’ then ‘D’
(this will boot you out of your EC2, go ahead and shell back in)

**13. See if the process is running**
```ps -A | grep "node"```

You should see it running like so with the first number being your processID:
```
[ec2-user@ip-172-31-19-210 ~]$ ps -A | grep "node"
17156 ?        00:00:00 node
17552 ?        00:00:01 node <defunct>
```
14. To follow the logs of the process
tail -f /proc/:processID/fd/1

Everything should be running correctly. Make sure you configured your AWS instance in order to change the security settings to allow port 3000 to be accessed.

Best,

The Matryx Team


# MatryxExplorer
### An open-source NodeJS API to easily read the Matryx Platform with full IPFS integration.

[![logo](https://github.com/matryx/matryx-alpha-source/blob/master/assets/Matryx-Logo-Black-1600px.png)](http://matryx.ai)
An open-source node.js api to read the MatryxPlatform and interact with IPFS to be consumed by anyone creating Matryx interfaces.


[![BuildStatus](https://travis-ci.org/matryx/MatryxExplorer.svg?branch=master)](https://travis-ci.org/matryx/MatryxExplorer)
[![Documentation Status](https://readthedocs.org/projects/matryxexplorer/badge/?version=latest)](http://matryxexplorer.readthedocs.io/en/latest/?badge=latest)

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

**3. Install Docker**  
* ```sudo yum install docker```

**4. Run MatryxIPFS on your docker instance**
* Go to the MatryxIPFS repository and do a Docker Build and then push it using the following script
```
echo "" > remote-actions.txt

echo "sudo yum update -y" >> remote-actions.txt
echo "sudo yum install -y docker" >> remote-actions.txt
echo "sudo service docker start" >> remote-actions.txt

echo -n "sudo " >> remote-actions.txt
aws ecr get-login --no-include-email --region us-west-1 >> remote-actions.txt

echo "sudo docker network create --subnet=172.18.0.0/16 --driver=bridge matryx-explorer-network" >> remote-actions.txt

echo "sudo docker volume create matryx-ipfs-volume" >> remote-actions.txt
echo "sudo docker stop matryx-ipfs" >> remote-actions.txt
echo "sudo docker rm -f matryx-ipfs" >> remote-actions.txt
echo "sudo docker run \
    -dit --restart unless-stopped \
    --name=matryx-ipfs \
    --net=matryx-explorer-network --ip 172.18.0.22 \
    -v matryx-ipfs-volume:/root \
    -p 8080:8080 -p 4001:4001 -p 5001:5001 -p 443:443 \
    matryx-ipfs" >> remote-actions.txt

ssh -i "<path/to/your/.pemFile>" ec2-user@<yourEC2ipAddress> 'bash -s' < remote-actions.txt

rm remote-actions.txt

```

**5. Get the IPFS Peer ID Hash**
* When you ssh into your EC2 instance, use a ```docker logs -f <containerID>```
and copy the Peer ID hash (it looks like `QmQ88tsHquF5reE7Bbe8PDpeXo1yzqbZBBKoqh9xV5V5la`, I just made a random one) for later


**6. Change the .env for the MatryxExplorer file to point at the IPFS node**
* Now we need to make sure that your MatryxExplorer instance points at the IPFS node you have running. In the '.env' file, swap out the existing Peer ID hash for the one you copied above. It should look like: 
```
IPFS_DAEMON_PEER_ID='/ip4/172.18.0.22/tcp/9999/ws/ipfs/QmQ88tsHquF5reE7Bbe8PDpeXo1yzqbZBBKoqh9xV5V5la'
```
* Make sure to save

**7. Build and deploy MatryxExplorer**
* Run a docker build
	```docker build .```
*  Now deploy to your EC2 instance using a script like this:
```
echo "" > remote-actions.txt

echo "sudo yum update -y" >> remote-actions.txt
echo "sudo yum install -y docker" >> remote-actions.txt
echo "sudo service docker start" >> remote-actions.txt

echo -n "sudo " >> remote-actions.txt
aws ecr get-login --no-include-email --region us-west-1 >> remote-actions.txt

echo "sudo docker network create --subnet=172.18.0.0/16 --driver=bridge matryx-explorer-network" >> remote-actions.txt


echo "sudo docker volume create matryx-alpha-explorer-volume" >> remote-actions.txt
echo "sudo docker stop matryx-alpha-explorer" >> remote-actions.txt
echo "sudo docker rm -f matryx-alpha-explorer" >> remote-actions.txt
echo "sudo docker run \
    -dit --restart unless-stopped \
    --name=matryx-alpha-explorer \
    --net=matryx-explorer-network \
    -v matryx-alpha-explorer-volume:/root \
    -p 80:3000 \
    matryx-alpha-explorer" >> remote-actions.txt

ssh -i "<path/to/your/.pemFile>" ec2-user@<yourEC2ipAddress> 'bash -s' < remote-actions.txt

rm remote-actions.txt
```

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

**9. It will now be running!**
* Make sure to check the logs of MatryxExplorer to see that there is the correct peer connected
* Make sure your EC2 security group is configured with the following ports
```
80
22
4001
443
5001
```
	

Best,

The Matryx Team


Architecture Below:
[![architecture](https://github.com/matryx/MatryxExplorer/blob/master/assets/MatryxArchitecture2018.png)](https://github.com/matryx/MatryxExplorer/blob/master/assets/MatryxArchitecture2018.png)

Interacting with Ipfs
======================================

The big part of the Ethereum Blockchain is that lots of data being written to the blockchain is a bad idea. It is very costly and could run into errors in the future.
As part of the shift towards WEB3.0, decentralized and distributed storage will be a huge part of the internet stack going forward. As per most decentralized applications (DAPPS), because the landscape for tokenized decentralized and distributed storage networks are not complete, everyone uses IPFS or Interplanetary File System.


IPFS in this application works in the following ways:

When you decide to create a tournament or make a contribution/submission, you will attach data to your transaction, whether it is a Tournament Description or a Submission containing large custom files.
Storing them on IPFS in order for our platform to access them needs to be done a certain way in order to parse the files.
It comes down to 3 main request body keys. The API accepts multipart/form-data and can handle multiple files using a POST call.

text: `description`,
text: `jsonContent`,
file: `filesContent`

When the API accepts the POST call, it will take that data and stores it to local storage. It then extracts the description and jsonContent key is available into a .txt file and is saved to the temp file along with any other files tagged with the key `filesContent`. It then provides the PATH of the directory to the IPFS node in order to get back a hash of the data which can be accessed by other IPFS nodes.

A major restriction in the development of the Matryx Explorer is that the IPFS-JS module does not support Peer Discovery at this time...A critical part of IPFS. Thus we are required to run an IPFS node right next to MatryxExplorer to get it to connect.
You will need to adjust a few things such as setting the Web Socket in the IPFS Daemon to be activated and so the MatryxExplorer API can reach it.

In order to set the IPFS daemon
1. Download IPFS

2. Run IPFS init
`ipfs init`

3. Show your config
`ipfs config show`

4. Run the following command in order to add the web-socket listener to port 9999 for the application.
`ipfs config --json Addresses '{ "API": "/ip4/127.0.0.1/tcp/5001", "Announce": [], "Gateway": "/ip4/127.0.0.1/tcp/8080", "NoAnnounce": [], "Swarm": [ "/ip4/0.0.0.0/tcp/4001", "/ip6/::/tcp/4001", "/ip4/127.0.0.1/tcp/9999/ws" ]}'`

5. Run the ipfs Daemon
`ipfs daemon`

In order to run it in the background and keep it up type:
`nohup ipfs daemon &`

You can check if that worked by searching for the process and see the Process ID (PID)
`ps -A | grep "ipfs"`

In the event you want to stop the IPFS node, you may kill the PID
`kill <PID>`

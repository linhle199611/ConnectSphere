# ConnectSphere

ConnectSphere is a decentralized chat app with the frontend build with Svelte and backend is built with [GUN](https://gun.eco/) and AWS Lambda and DynamoDB. This project implement three distriuted system algorithms: leader election, broadcast, and timestamp. Through Gun.js, ConnectSphere is a peer to peer network where peers can receive or propagate messages to one another and this is also how data stored. So, the ConnectSphere's database is all the peers in the network unified because all the peers have their own data that they are subscribed to.

Steps to run:
```
git clone <this-repo>
npm install
npm run dev
navigate to http://localhost:5000/ on a browser to access UI
```
```
Leo did Timestamp
Jason did Broadcast and Leader Election
Paul attempted gossip and distributed snapshop
```

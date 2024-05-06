// A websocket server

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
const peers = [];

console.log('Server started on port 8080');

// Broadcast messages to all peers
const broadcast = (message) => {
  peers.forEach(peer => {
      if (peer.readyState === WebSocket.OPEN) {
          peer.send(message);
      }
  });
}

wss.on('connection', function connection(ws) {
  // If the client wants to join the server, save the connection
  ws.on('message', function incoming(message) {
    message = JSON.parse(message);
    console.log('received message:', message);
    if (message.type === 'JOIN') {
      console.log('received JOIN');
      peers.push(ws);
      ws.send('JOINED');
    } else if (message.type === 'LEAVE') {
      console.log('received LEAVE');
      const index = peers.indexOf(ws);
      if (index > -1) {
          peers.splice(index, 1);
      }
    } else if (message.type === 'BROADCAST') {
      console.log('received BROADCAST');
      broadcast(message.payload);
    }
  });
}
);
// A WebSocket Client

const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
  ws.send(JSON.stringify({ type: 'JOIN', payload: { username
: 'Alice' } }));
}
);

ws.on('message', function incoming(data) {
  console.log('received:', data);
}
);
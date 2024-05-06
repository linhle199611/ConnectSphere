import GUN from 'gun';
import 'gun/sea';
import 'gun/axe';
import { writable } from 'svelte/store';

// Database
export const db = GUN();

// Gun User
export const user = db.user().recall({ sessionStorage: true });

// Current User's username
export const username = writable('');

user.get('alias').on(v => username.set(v));

// List of connected peers
// export const connectedPeers = writable([]);
const query = 'https://rnfv2duzvjfbkcaoc6u4rcdp3a0pwtji.lambda-url.us-west-1.on.aws/?secret=sdfioghwsdf9uio23';
// WebSocket connection
export let ws;

db.on('auth', async (event) => {
  const alias = await user.get('alias'); // Get the user's alias
  if (alias) {
    username.set(alias);
    console.log(`signed in as ${alias}`);
    // console.log(JSON.stringify({ type: 'JOIN', payload: { username: alias } }));


    ws = new WebSocket('wss://yhk8r8gnfh.execute-api.us-west-1.amazonaws.com/production/');
    // console.log('after json print');
    // Handle WebSocket open event
    ws.onopen = (event) => {

      const send_stuff = "wss://yhk8r8gnfh.execute-api.us-west-1.amazonaws.com/production?username=" + alias;


      // console.log('sending a message');
      // console.log(send_stuff);
      ws.send(send_stuff);
      // console.log('message sent');
    };

    // Handle WebSocket messages
    // ws.onmessage = (event) => {

    //   console.log('msg received')
    //   console.log(event)
      
    //   const requestURL = `https://rnfv2duzvjfbkcaoc6u4rcdp3a0pwtji.lambda-url.us-west-1.on.aws/?secret=sdfioghwsdf9uio23`;

    //   // Send a request for users
    //   fetch(requestURL)
    //   .then(response => {
    //       console.log('Response received:', response);
    //   })
    //   .catch(error => {
    //       console.error('Error sending request:', error);
    //   });

    // };
// Handle WebSocket messages
    ws.onmessage = (event) => {
      // console.log('Message received:', event);

      const requestURL = 'https://rnfv2duzvjfbkcaoc6u4rcdp3a0pwtji.lambda-url.us-west-1.on.aws/?secret=sdfioghwsdf9uio23';

      // Send a request for users
      setTimeout(() => {
        console.log('Delayed console.log');
        fetch(requestURL, {
            method: 'GET',
            credentials: 'include'
        })
    }, 5); // 5 milliseconds delay
    
    setTimeout(() => {
      fetch(requestURL, {
          method: 'GET',
          credentials: 'include'
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json(); // Assuming the server responds with JSON
      })
      .then(data => {
          console.log('Data received:', data);
          const users = data.users;
          console.log(`userlist = `, users);
          users.sort((a, b) => a.ConnectionId.localeCompare(b.ConnectionId));
  
          // Getting the highest lexicographical ConnectionId
          const highestConnectionId = users[users.length - 1].ConnectionId;
  
          // Printing the highest lexicographical ConnectionId
          console.log("Leader:", highestConnectionId);
      })
      .catch(error => {
          console.error('Error sending request:', error);
      });
  }, 10); // 10 milliseconds delay
  
    };
  }
});

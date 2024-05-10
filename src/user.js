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

export let ws;


db.on('auth', async (event) => {
  const alias = await user.get('alias'); // Get the user's alias
  if (alias) {
    username.set(alias);
    console.log(`signed in as ${alias}`);

    ws = new WebSocket(`wss://yhk8r8gnfh.execute-api.us-west-1.amazonaws.com/production?username=${alias}`);
    // Define a function to fetch data
    function fetchData() {
      const requestURL = 'https://rnfv2duzvjfbkcaoc6u4rcdp3a0pwtji.lambda-url.us-west-1.on.aws/?secret=sdfioghwsdf9uio23';

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
        // console.log('Data received:', data);
        const users = data.users;
        console.log(`userlist = `, users);
        if (users && users.length > 0) { // Check if users array is not empty
          users.sort((a, b) => a.username.localeCompare(b.username));

          const highestUsername = users[users.length - 1].username;

          console.log("Leader username:", highestUsername);
        } else {
          console.log("No users found.");
        }
      })
      .catch(error => {
        console.error('Error sending request:', error);
      });
    }
    // Handle WebSocket open event
    ws.onopen = (event) => {
      const send_stuff = "wss://yhk8r8gnfh.execute-api.us-west-1.amazonaws.com/production?username=" + alias;
      ws.send(send_stuff);
    };


    // ws.onmessage = (event) => {
    //   console.log(`Received broadcast from AWS API Gateway`);
    //   fetchData();
    //   // console.log('Message received:', event.data);  // debugging print
    // };
    ws.onmessage = function(event) {
      console.log('Received broadcast from AWS');
      fetchData();
      // try {  // debugging prints
      //     const parsedData = JSON.parse(event.data);
      //     console.log('Parsed data:', parsedData);

      //     if (parsedData.message && Array.isArray(parsedData.message)) {
      //         parsedData.message.forEach((entry, index) => {
      //             console.log(`Entry ${index + 1}: ConnectionId = ${entry.ConnectionId}, Username = ${entry.username}`);
      //         });
      //     }
      // } catch (error) {
      //     console.error('Error parsing JSON:', error);
      // }
  };




    // Call fetchData initially
    // fetchData();

    // Set up setInterval to call fetchData every 10 seconds
    setInterval(fetchData, 10000); // 10 seconds = 10000 milliseconds
  }
});

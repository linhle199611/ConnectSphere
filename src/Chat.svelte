<script>
  import Login from './Login.svelte';
  import ChatMessage from './ChatMessage.svelte';
  import { onMount } from 'svelte';
  import { username, user } from './user';
  import debounce from 'lodash.debounce';

  import GUN from 'gun';
  // const db = GUN('https://gun-chat-dapp.web.app/');
  const db = GUN();

  let newMessage;
  let messages = [];
  let messagePuts = [];

  let scrollBottom;
  let lastScrollTop;
  let canAutoScroll = true;
  let unreadMessages = false;

  function autoScroll() {
    setTimeout(() => scrollBottom?.scrollIntoView({ behavior: 'auto' }), 50);
    unreadMessages = false;
  }

  function watchScroll(e) {
    canAutoScroll = (e.target.scrollTop || Infinity) > lastScrollTop;
    lastScrollTop = e.target.scrollTop;
  }

  $: debouncedWatchScroll = debounce(watchScroll, 1000);

  onMount(() => {
    var match = {
      // lexical queries are kind of like a limited RegEx or Glob.
      '.': {
        // property selector
        '>': new Date(+new Date() - 1 * 1000 * 60 * 60 * 3).toISOString(), // find any indexed property larger ~3 hours ago
      },
      '-': 1, // filter in reverse
    };

    // Get Messages
    db.get('chat')
      .map(match)
      .once(async (data, id) => {
        if (data) {
          // Key for end-to-end encryption
          const key = '#foo';

          var message = {
            // transform the data
            who: await db.user(data).get('alias'), // a user might lie who they are! So let the user system detect whose data it is.
            what: (await SEA.decrypt(data.what, key)) + '', // force decrypt as text.
            when: GUN.state.is(data, 'what'), // get the internal timestamp for the what property.
          };

          // Don't record message if it's undefined, so that the duplicate keys error doesn't happen
          if (message.what && message.what !== 'undefined' && message.when !== 'undefined') {
            messages = [...messages.slice(-100), message].sort((a, b) => a.when - b.when);
            if (canAutoScroll) {
              autoScroll();
            } else {
              unreadMessages = true;
            }
          }
        }
      });
    });

  // Trying to implement Chandy Lampot algorithm
  // Doesn't really separate the snapshot into different users, but it just all goes under the localhost
  // let ev = null;
  // let recordingPeers = new Set();

  // db.get('chat').get('snapshot').get('marker').on((data, id, _msg, _ev) => {
  //   ev = _ev;
  //   // console.log(data);
  //   // Should I make sure that the marker message is not from itself?
  //   if (!data.reset && data.sender) {
  //     // console.log('Received marker message from', data.sender);
  //     // If marker message was first seen, send marker message to all other peers
  //     if (!recordingPeers.has(data.sender)) {
  //       messages.forEach((message) => {
  //         db.get('chat').get('snapshot').set(message);
  //       });
  //       // Start recording messages from peers, except the sender
  //       Object.keys(db._.opt.peers).filter(peer => peer !== data.sender).forEach(peer => recordingPeers.add(peer));
  //       // Send marker message to all other peers
  //       sendMarkerMessage();
  //     } else if (recordingPeers.size > 1) {
  //       // Record messages from the sender
  //       recordingPeers.delete(data.sender);

  //       // Record incoming messages from sender
  //       messages.forEach((message) => {
  //         if (message.who && message.what !== 'undefined') {
  //           db.get('chat').get('snapshot').set(message);
  //         }
  //       });
  //     } else if (recordingPeers.size === 1){
  //       // Record messages from the sender
  //       recordingPeers.delete(data.sender);

  //       // Record incoming messages from sender
  //       messages.forEach((message) => {
  //         db.get('chat').get('snapshot').set(message);
  //       });

  //       // Console log the partial snapshot
  //       db.get('chat').get('snapshot').once((data, id) => {
  //         console.log(data);
  //       });

  //       // Clear recordingPeers
  //       recordingPeers.clear();

  //       // Clear recordingPeers in other peers
  //       db.get('chat').get('snapshot').get('marker').put({ reset: true });

  //       // Stop recording messages from peers
  //       ev.off();
  //     }
  //   } else if (data.reset) {
  //     console.log('Resetting snapshot');
  //     recordingPeers.clear();
  //   }
  // });

  async function startSnapshot() {
    // Clear snapshot
    // await db.get('chat').get('snapshot').put(null);

    // Trying to get the snapshot to be separated by user, but gun.js is being difficult to work with
    // Especially with recording the local state, see below
    // messagePuts.forEach((messagePut) => {
    //   // Record local state of chat messages for the user
    //   messagePut.then((data) => {
    //     console.log('Message put data:', data);
    //     if (data.who && data.what !== 'undefined') {
    //       db.get('chat').get('snapshot').set(data);
    //     }
    //   });
    // });

    // I can either use .set() or .put() to record the local state of chat messages for the user
    // But .set() just adds the data with a unique id, so the same message can be added multiple times
    // and with .put(), it only returns the three properties (who, what, when) of the message, so it only records one message
    // // Record local state of chat messages for the user
    // messages.forEach((message) => {
    //   console.log(message);
    //   if (message.who && message.what !== 'undefined') {
    //     db.get('chat').get('snapshot').get('asdfghjkl').put(message);
    //   }
    // });

    // console.log('Snapshot');
    // db.get('chat').get('snapshot').get('asdfghjkl').once(async (data, id) => {
    //   if (data) {
    //     console.log('Data:', data);
    //   }
    // });

    // await db.get('chat').get('snapshot').get($username).once(async (data, id) => {
    //   if (data) {
    //     console.log(data);
    //     // Key for end-to-end encryption
    //     const key = '#foo';

    //     var message = {
    //       // transform the data
    //       who: await db.user(data).get('alias'), // a user might lie who they are! So let the user system detect whose data it is.
    //       what: (await SEA.decrypt(data.what, key)) + '', // force decrypt as text.
    //       when: GUN.state.is(data, 'what'), // get the internal timestamp for the what property.
    //     };

    //     console.log(message);
    //   }
    // });

    // Console log the snapshot after 5 seconds
    // setTimeout(() => {
    //   console.log('Snapshot');
    //   db.get('chat').get('snapshot').get(username).once(async (data, id) => {
    //     await console.log(data);
    //   });
    //   console.log('End of Snapshot');
    // }, 5000);
    // Clear recordingPeers
    // recordingPeers.clear();

    // // Clear recordingPeers in other peers
    // db.get('chat').get('snapshot').get('marker').put({ restart: true });

    // // Clear snapshot
    // db.get('chat').get('snapshot').put(null);

    // // Send marker message to all peers
    // sendMarkerMessage();

    // // Start recording messages from peers
    // Object.keys(db._.opt.peers).forEach(peer => recordingPeers.add(peer));
  }

  function sendMarkerMessage() {
    // Send marker message with the sender's URL
    db.get('chat').get('snapshot').get('marker').put({ reset: false, received: false, sender: window.location.href });
  }

  async function sendMessage() {
    const secret = await SEA.encrypt(newMessage, '#foo');
    const message = user.get('all').set({ what: secret });
    const index = new Date().toISOString();
    db.get('chat').get(index).put(message);
    // Maybe I could push the put into the set from: https://gun.eco/docs/API#-a-name-set-a-gun-set-data-callback-
    // const messagePut = db.get('chat').get(index).put(message);
    // console.log(messagePut);
    // db.get('chat').get('messagePut1234').set(message);
    newMessage = '';
    canAutoScroll = true;
    autoScroll();
  }
</script>

<div class="container">
  {#if $username}
    <main on:scroll={debouncedWatchScroll}>
      {#each messages as message (message.when)}
        <ChatMessage {message} sender={$username} />
      {/each}

      <div class="dummy" bind:this={scrollBottom} />
    </main>

    <form on:submit|preventDefault={sendMessage}>
      <input type="text" placeholder="Type a message..." bind:value={newMessage} maxlength="100" />

      <button type="submit" disabled={!newMessage}>💥</button>
    </form>

    {#if !canAutoScroll}
    <div class="scroll-button">
      <button on:click={autoScroll} class:red={unreadMessages}>
        {#if unreadMessages}
          💬
        {/if}

        👇
      </button>
    </div>
   {/if}
    <div class="snapshot">
      <button on:click={startSnapshot}>Snapshot</button>
    </div>
  {:else}
    <main>
      <Login />
    </main>
  {/if}
</div>

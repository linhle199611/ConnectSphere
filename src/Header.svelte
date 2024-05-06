<script>
  import { username, user, ws } from './user';

  function signout() {
    user.leave();
    username.set('');

    // Send a 'LEAVE' message to the WebSocket server
    if (ws && ws.readyState === WebSocket.OPEN) {

      ws.close();
    }  
  }

</script>

<header>
<h1 style="color: yellow">ConnectSphere</h1>
  {#if $username}
    <div class="user-bio">
      
      <span>Hello <strong>{$username}</strong></span>
      <img src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${$username}`} alt="avatar" /> 
    </div>

    <button class="signout-button" on:click={signout}>Sign Out</button>

    {:else}

      <h3 style="color: yellow">Chat</h3>
  {/if}
</header>

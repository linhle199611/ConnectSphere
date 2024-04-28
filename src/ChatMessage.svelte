<script>
  export let message;
  export let sender;

  const messageClass = message.who === sender ? 'sent' : 'received';

  //console.log("------------------------------------");
  //console.log("This is ChatMessage.svelte");
  //console.log("------------------------------------");
  // <time>{ts.toLocaleTimeString()}</time>
  
  const avatar = `https://api.dicebear.com/8.x/pixel-art/svg?seed=${message.who}`;

  const ts = new Date(message.when);
</script>

<div class={`message ${messageClass}`}>
  <img src={avatar} alt="avatar" />
  <div class="message-text">
    <p>{message.what}</p>

    <time>{message.when}</time>
  </div>
</div>

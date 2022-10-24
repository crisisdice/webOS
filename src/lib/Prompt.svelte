<style>
  .usr {
    color: green;
  }

  .pwd {
    color: blue;
  }

  .prompt {
    padding-top: 6px;
  }
</style>

<script lang="ts">
  let usr = 'root@127.0.0.1'
  let pwd = '~/'
</script>

<div class="prompt">
  <span>
    <span class="usr">{usr}</span>:<span class="pwd">{pwd}</span> $ <slot />
  </span>
</div>

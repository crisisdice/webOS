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
  export let usr
  export let pwd
</script>

<div class="prompt">
  <span>
    <span class="usr">{`${usr}@127.0.0.1`}</span>:<span class="pwd"
      >{pwd === `/home/${usr}` ? '~/' : pwd + '/'}</span
    >
    $ <slot />
  </span>
</div>

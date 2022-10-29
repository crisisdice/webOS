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
  export let USER: string
  export let PWD: string
</script>

<div class="prompt">
  <span>
    <span class="usr">{`${USER}@127.0.0.1`}</span>:<span class="pwd"
      >{PWD === `/home/${USER}` ? '~/' : `${PWD}/`}</span
    >
    $ <slot />
  </span>
</div>

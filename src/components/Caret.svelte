<style>
  .caret-empty {
    animation: empty 1s step-end infinite;
    color: transparent;
  }

  .caret-full {
    animation: full 1s step-end infinite;
    color: #fff;
  }

  @keyframes empty {
    50% {
      background-color: #fff;
    }
  }

  @keyframes full {
    50% {
      background-color: #fff;
      color: #000;
    }
  }
</style>

<script lang="ts">
  export let PRECARET: string
  export let CARET: string
  export let CARET_ACTIVE: boolean
  export let POSTCARET: string
</script>

<span
  >{PRECARET}<span class={CARET_ACTIVE ? 'caret-full' : 'caret-empty'}>{CARET}</span
  >{POSTCARET}</span
>

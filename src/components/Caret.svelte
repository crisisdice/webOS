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
  import type { Line } from '../types'
  export let COMMAND_LINE: Line

  let { PRECARET, CARET_ACTIVE, CARET, POSTCARET } = COMMAND_LINE

  // TODO zero width caret
</script>

<span
  >{PRECARET}<span class={CARET_ACTIVE ? 'caret-full' : 'caret-empty'}>{CARET}</span
  >{POSTCARET}</span
>

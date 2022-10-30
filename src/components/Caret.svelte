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

  // TODO zero width caret
</script>

<span
  >{COMMAND_LINE.PRECARET}<span class={COMMAND_LINE.CARET_ACTIVE ? 'caret-full' : 'caret-empty'}
    >{COMMAND_LINE.CARET}</span
  >{COMMAND_LINE.POSTCARET}</span
>

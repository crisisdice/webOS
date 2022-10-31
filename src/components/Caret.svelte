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

  let { PRECARET, EOL, CARET, POSTCARET, CARET_WIDTH } = COMMAND_LINE

  const renderCaret = () => {
    if (CARET_WIDTH === 0) return '|'
    if (EOL) return '_'
    return CARET
  }
</script>

<!-- TODO highlighting text -->
<span
  >{PRECARET}<span class={EOL ? 'caret-empty' : 'caret-full'}>{renderCaret()}</span
  >{POSTCARET}</span
>

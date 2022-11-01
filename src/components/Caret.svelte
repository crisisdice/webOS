<style>
  .caret-empty {
    animation: empty 1s step-end infinite;
    color: transparent;
  }

  .caret-full {
    animation: full 1s step-end infinite;
    color: #fff;
  }

  .caret-line {
    animation: line 1s step-end infinite;
    position: absolute;
    border-left: 1px solid white;
    color: transparent;
    height: 30px;
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

  @keyframes line {
    50% {
      padding-left: 1px;
      border-left: none;
    }
  }
</style>

<script lang="ts">
  import type { Line } from '../types'

  export let COMMAND_LINE: Line

  let { PRECARET, EOL, CARET, POSTCARET, CARET_WIDTH } = COMMAND_LINE

  const caretClass = () => {
    if (CARET_WIDTH === 0) return 'caret-line'
    if (EOL) return 'caret-empty'
    return 'caret-full'
  }
</script>

<span
  >{PRECARET}<span class={caretClass()}>{CARET_WIDTH === 0 ? '\u3164' : CARET ?? '_'}</span
  >{POSTCARET}</span
>

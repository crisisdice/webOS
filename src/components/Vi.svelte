<style>
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
  }

  .buffer {
    display: block;
  }

  .line {
    white-space: pre;
    padding-top: 2px;
    padding-bottom: 2px;
  }

  .coords {
    float: right;
    padding-right: 50px;
  }
</style>

<script lang="ts">
  import Caret from './Caret.svelte'

  import type { State, ViState } from '../types'
  import { VI_MODE } from '../lib'
  import { lineToString } from '../utils'

  export let STATE: State

  let {
    MODE,
    COMMAND_LINE,
    COORDS: { x, y },
    BUFFER: { BUFFER_PRE, LINE, BUFFER_POST },
  } = STATE as ViState
</script>

<div>
  <div class="buffer">
    {#each BUFFER_PRE as line, index}
      <div class="line">{index + 1} {line}</div>
    {/each}
    <div class="line">
      {BUFFER_PRE.length + 1}
      {#if MODE === VI_MODE.COMMAND}{lineToString(LINE)}{:else}<Caret COMMAND_LINE={LINE} />{/if}
    </div>
    {#each BUFFER_POST as line, index}
      <div class="line">{BUFFER_PRE.length + 2 + index} {line}</div>
    {/each}
  </div>
  <div class="footer">
    {#if MODE === VI_MODE.COMMAND}
      : <Caret {COMMAND_LINE} />
    {/if}
    <span class="coords">{`${y + 1},${x + 1}`}</span>
  </div>
</div>

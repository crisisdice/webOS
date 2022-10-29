<style>
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
  }

  .full-width {
    display: block;
  }
  .coords {
    float: right;
    padding-right: 50px;
  }
</style>

<script lang="ts">
  import type { AppState, VimAppState } from 'src/lib/types'
  import { VI_MODE } from '../lib/vi/state'
  import Caret from './Caret.svelte'

  export let STATE: AppState & Partial<VimAppState>
</script>

<div>
  <div class="full-width">
    {#if STATE.MODE !== VI_MODE.COMMAND}
      {#each STATE.BUFFER.BUFFER_PRE as line, index}
        <div>{index + 1} {line}</div>
      {/each}
      <div>
        {STATE.BUFFER.BUFFER_PRE.length + 1}
        <Caret COMMAND_LINE={STATE.BUFFER.LINE} />
      </div>
      {#each STATE.BUFFER.BUFFER_POST as line, index}
        <span> {STATE.BUFFER.BUFFER_PRE.length + 1 + index} {line}</span>
      {/each}
    {:else}
      {#each STATE.BUFFER.BUFFER_POST as line, index}
        <div>{index + 1} {line}</div>
      {/each}
    {/if}
  </div>
  <div class="footer">
    {#if STATE.MODE === VI_MODE.COMMAND}
      : <Caret COMMAND_LINE={STATE.COMMAND_LINE} />
    {/if}
    <span class="coords">{`${STATE.COORDS.y + 1},${STATE.COORDS.x + 1}`}</span>
  </div>
</div>

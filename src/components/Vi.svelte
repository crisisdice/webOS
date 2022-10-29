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
  import type { VimAppState } from 'src/lib/types'
  import { VI_MODE } from '../lib/vi/state'
  import Caret from './Caret.svelte'

  export let APP_STATE: VimAppState
</script>

<div>
  <div class="full-width">
    {#if APP_STATE.MODE !== VI_MODE.COMMAND}
      {#each APP_STATE.BUFFER_PRE as line, index}
        <div>{index + 1} {line}</div>
      {/each}
      <div>
        {APP_STATE.BUFFER_PRE.length + 1}
        <Caret COMMAND_LINE={APP_STATE.LINE} />
      </div>
      {#each APP_STATE.BUFFER_POST as line, index}
        <span> {APP_STATE.BUFFER_PRE.length + 1 + index} {line}</span>
      {/each}
    {:else}
      {#each APP_STATE.BUFFER as line, index}
        <div>{index + 1} {line}</div>
      {/each}
    {/if}
  </div>
  <div class="footer">
    {#if APP_STATE.MODE === VI_MODE.COMMAND}
      : <Caret COMMAND_LINE={APP_STATE.COMMAND_LINE} />
    {/if}
    <span class="coords">{`${APP_STATE.COORDS.y + 1},${APP_STATE.COORDS.x + 1}`}</span>
  </div>
</div>

<style>
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    color: #000;
  }
</style>

<script lang="ts">
  import type { VimAppState } from 'src/lib/types'
  import Caret from './Caret.svelte'

  // TODO create rendering interface
  export let APP_STATE: VimAppState
  //{#if appState.footerVisible}
</script>

<div>
  <div>Vi</div>
  {#if true}
    <div class="footer">
      : <Caret
        PRECARET={APP_STATE.footerPreCaret ?? ''}
        CARET={APP_STATE.footerCaret ?? ''}
        POSTCARET={APP_STATE.footerPostCaret ?? ''}
        CARET_ACTIVE={false}
      />
    </div>
  {/if}
</div>

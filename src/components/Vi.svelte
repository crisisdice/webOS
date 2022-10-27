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
  export let appState: VimAppState
  //{#if appState.footerVisible}
</script>

<div>
  <div>Vi</div>
  {#if true}
    <div class="footer">
      : <Caret
        precaret={appState.footerPreCaret ?? ''}
        caret={appState.footerCaret ?? ''}
        postcaret={appState.footerPreCaret ?? ''}
        caretActive={false}
      />
    </div>
  {/if}
</div>

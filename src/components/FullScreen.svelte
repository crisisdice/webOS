<style>
</style>

<script lang="ts">
  import type { AppState, VimAppState } from 'src/lib/types'

  import Vi from './Vi.svelte'

  export let APP_STATE: VimAppState | AppState
</script>

<div>
  {#if APP_STATE.NAME === 'vi'}
    <Vi {APP_STATE} />
  {:else}
    <div>App not recognized</div>
  {/if}
</div>

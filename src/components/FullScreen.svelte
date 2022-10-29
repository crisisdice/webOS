<style>
</style>

<script lang="ts">
  import type { AppState, VimAppState } from 'src/lib/types'

  import Vi from './Vi.svelte'

  export let APP_NAME: string
  export let APP_STATE: AppState | VimAppState
</script>

<div>
  {#if APP_NAME === 'vi'}
    <Vi {APP_STATE} />
  {:else}
    <div>App not recognized</div>
  {/if}
</div>

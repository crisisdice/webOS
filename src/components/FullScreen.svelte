<style>
</style>

<script lang="ts">
  import type { VimAppState } from 'src/lib/types'

  import Vi from './Vi.svelte'

  export let APP_NAME: string
  export let APP_STATE: VimAppState
</script>

<div>
  {#if APP_NAME === 'vi'}
    <Vi {APP_STATE} />
  {:else}
    <div>App not recognized</div>
  {/if}
</div>

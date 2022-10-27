<style>
</style>

<script lang="ts">
  import type { AppState } from 'src/lib/types'

  import Vi from './Vi.svelte'

  export let appName: string
  export let appState: AppState
</script>

<div>
  {#if appName === 'vi'}
    <Vi {appState} />
  {:else}
    <div>App not recognized</div>
  {/if}
</div>

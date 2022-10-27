<style>
</style>

<script lang="ts">
  import Vi from "./Vi.svelte"
  export let appName: string
</script>

<div>
  {#if appName === 'vi'}
    <Vi></Vi>
  {:else}
    <div>App not recognized</div>
  {/if}
</div>

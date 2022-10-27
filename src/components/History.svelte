<style>
</style>

<script lang="ts">
  import Prompt from './Prompt.svelte'
  import type { Commands } from 'src/lib/types'

  export let oldCmds: Commands
</script>

<div>
  {#each oldCmds as oldCmd}
    <Prompt pwd={oldCmd.wd} usr={oldCmd.usr}>{oldCmd.cmd}</Prompt>
    {#if oldCmd.stdout}<span>{oldCmd.stdout}</span>{/if}
  {/each}
</div>

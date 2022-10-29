<style>
</style>

<script lang="ts">
  import Prompt from './Prompt.svelte'
  import type { Commands } from 'src/lib/types'

  export let OLD_COMMANDS: Commands
</script>

<div>
  {#each OLD_COMMANDS as oldCmd}
    <Prompt PWD={oldCmd.wd} USER={oldCmd.usr}>{oldCmd.cmd}</Prompt>
    <!-- TODO multiline stdout -->
    {#if oldCmd.stdout}<span>{oldCmd.stdout}</span>{/if}
  {/each}
</div>

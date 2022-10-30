<style>
</style>

<script lang="ts">
  import Prompt from './Prompt.svelte'
  import type { Commands } from '../types'

  export let OLD_COMMANDS: Commands
</script>

<div>
  {#each OLD_COMMANDS as oldCmd}
    <Prompt PWD={oldCmd.wd} USER={oldCmd.usr}>{oldCmd.cmd}</Prompt>
    {#each oldCmd.stdout?.split('\n') as stdout}<div>{stdout}</div>{/each}
  {/each}
</div>

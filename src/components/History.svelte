<style>
</style>

<script lang="ts">
  import Prompt from './Prompt.svelte'
  import type { Command } from '../types'

  export let OLD_COMMANDS: Command[]

  const parse = (oldCmd: Command) => oldCmd.stdout?.split('\n') ?? []
</script>

<div>
  {#each OLD_COMMANDS as oldCmd}
    <Prompt PWD={oldCmd.wd} USER={oldCmd.usr}>{oldCmd.cmd}</Prompt>
    {#each parse(oldCmd) as stdout}<div>{stdout}</div>{/each}
  {/each}
</div>

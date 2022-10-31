<style>
</style>

<script lang="ts">
  import Prompt from './Prompt.svelte'
  import type { Command } from '../types'

  import { lineToString } from '../utils'

  export let OLD_COMMANDS: Command[]

  const parse = (stdout: string) => stdout.split('\n')
</script>

<div>
  {#each OLD_COMMANDS as { PWD, USER, COMMAND_LINE, STDOUT }}
    <Prompt {PWD} {USER}>{lineToString(COMMAND_LINE)}</Prompt>
    {#each parse(STDOUT) as stdout}<div>{stdout}</div>{/each}
  {/each}
</div>

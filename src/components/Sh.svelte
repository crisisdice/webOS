<style>
</style>

<script lang="ts">
  import Prompt from './Prompt.svelte'
  import History from './History.svelte'
  import Caret from './Caret.svelte'

  import type { AppState, ShellState } from 'src/lib/types'
  export let STATE: AppState & Partial<ShellState>
</script>

<div>
  <History OLD_COMMANDS={STATE.OLD_COMMANDS} />
  <Prompt PWD={STATE.PWD} USER={STATE.USER}>
    <Caret COMMAND_LINE={STATE.COMMAND_LINE} />
  </Prompt>
</div>

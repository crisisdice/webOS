<style>
</style>

<script lang="ts">
  import Prompt from './Prompt.svelte'
  import History from './History.svelte'
  import Caret from './Caret.svelte'

  import type { AppState, ShellState } from '../types'
  export let STATE: AppState & Partial<ShellState>

  let { OLD_COMMANDS, PWD, USER, COMMAND_LINE } = STATE
</script>

<div>
  <History {OLD_COMMANDS} />
  <Prompt {PWD} {USER}>
    <Caret {COMMAND_LINE} />
  </Prompt>
</div>

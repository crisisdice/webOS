<script lang="ts">

  import Sh from './components/Sh.svelte'
  import Vi from './components/Vi.svelte'

  import { init } from './lib/sh'
  import { refocus } from './lib/utils'
  import type { State } from './lib/types'

  import { INITAL_STATE } from './state'

  window.onload = () => {
    init()
  }

  let STATE: State = { ...INITAL_STATE }

  const up = (e: KeyboardEvent) => {
    STATE = STATE.UP_MAPPING({ e, STATE })
  }

  const down = (e: KeyboardEvent) => {
    STATE = STATE.DOWN_MAPPING({ e, STATE })
  }

</script>

<div>
  {#if STATE.NAME === 'sh'}
    <Sh {STATE} />
  {:else if STATE.NAME === 'vi'}
    <Vi {STATE} />
  {:else}
    <div>App not recognized</div>
  {/if}
  <!-- svelte-ignore a11y-autofocus -->
  <input autofocus on:keydown={down} on:keyup={up} on:blur={refocus} />
</div>

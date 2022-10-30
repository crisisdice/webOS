<script lang="ts">
  import Sh from './components/Sh.svelte'
  import Vi from './components/Vi.svelte'

  import type { State } from './types'
  import { refocus, init, INITAL_STATE } from './utils'

  window.onload = () => {
    init()
    console.log('INITIALIZED')
  }

  let STATE: State = { ...INITAL_STATE }

  const up = (e: KeyboardEvent) => {
    STATE = STATE.UP_MAPPING({ e, STATE })
    console.log({ key: e.key, ...STATE })
  }

  const down = (e: KeyboardEvent) => {
    STATE = STATE.DOWN_MAPPING({ e, STATE })
  }
</script>

<div>
  <!-- TODO find way to destructure state -->
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

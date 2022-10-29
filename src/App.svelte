<script lang="ts">
  import Prompt from './components/Prompt.svelte'
  import History from './components/History.svelte'
  import Caret from './components/Caret.svelte'
  import FullScreen from './components/FullScreen.svelte'

  import { init } from './lib/sh'
  import { refocus } from './lib/utils'
  import { INITAL_STATE } from './state'

  /* state */
  let {
    OLD_COMMANDS,
    APP_STATE,
    COMMAND_LINE,
    USER,
    PWD,
  } = INITAL_STATE

  /* main event handler */
  export const handle = (up: boolean) => {
    return (e: KeyboardEvent) => {
      ({
        OLD_COMMANDS,
        APP_STATE,
        COMMAND_LINE,
        USER,
        PWD,
      } = { ...(up ? APP_STATE.UP_MAPPING : APP_STATE.DOWN_MAPPING)(
        {
          e,
          STATE: {
            OLD_COMMANDS,
            APP_STATE,
            COMMAND_LINE,
            USER,
            PWD,
          }
        })
      })
    }
  }

  /* load fs into local storage */
  window.onload = () => {
    // TODO better logging
    console.log('initalizing')
    init()
  }
</script>

<div>
  {#if !APP_STATE.FULL_SCREEN}
    <History {OLD_COMMANDS} />
    <Prompt {PWD} {USER}>
      <Caret {COMMAND_LINE} />
    </Prompt>
  {:else}
    <FullScreen {APP_STATE} />
  {/if}
  <!-- svelte-ignore a11y-autofocus -->
  <input autofocus on:keydown={handle(false)} on:keyup={handle(true)} on:blur={refocus} />
</div>

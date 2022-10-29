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
    CONTROL_DOWN,
    OLD_COMMANDS,
    FULL_SCREEN,
    APP_NAME,
    APP_STATE,
    UP_MAPPING,
    DOWN_MAPPING,
    PRECARET,
    CARET,
    POSTCARET,
    CARET_ACTIVE,
    USER,
    PWD,
  } = INITAL_STATE

  /* main event handler */
  export const handle = (up: boolean) => {
    return (e: KeyboardEvent) => {
      ({
        CONTROL_DOWN,
        OLD_COMMANDS,
        FULL_SCREEN,
        APP_NAME,
        APP_STATE,
        UP_MAPPING,
        DOWN_MAPPING,
        PRECARET,
        CARET,
        POSTCARET,
        CARET_ACTIVE,
        USER,
        PWD,
      } = { ...(up ? UP_MAPPING : DOWN_MAPPING)(
        {
          e,
          STATE: {
            CONTROL_DOWN,
            OLD_COMMANDS,
            FULL_SCREEN,
            APP_NAME,
            APP_STATE,
            UP_MAPPING,
            DOWN_MAPPING,
            PRECARET,
            CARET,
            POSTCARET,
            CARET_ACTIVE,
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
  {#if !FULL_SCREEN}
    <History {OLD_COMMANDS} />
    <Prompt {PWD} {USER}>
      <Caret {PRECARET} {CARET} {POSTCARET} {CARET_ACTIVE} />
    </Prompt>
  {:else}
    <FullScreen {APP_NAME} {APP_STATE} />
  {/if}
  <!-- svelte-ignore a11y-autofocus -->
  <input autofocus on:keydown={handle(false)} on:keyup={handle(true)} on:blur={refocus} />
</div>

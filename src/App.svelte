<script lang="ts">
  import Prompt from './components/Prompt.svelte'
  import History from './components/History.svelte'
  import Caret from './components/Caret.svelte'
  import FullScreen from './components/FullScreen.svelte'

  import { init } from './lib/sh'
  import { DASH } from './lib/constants'
  import { refocus } from './lib/utils'
  import { standardUp, standardDown } from './mappings'

  import type { AppState, Commands } from 'src/lib/types'

  /* state */
  let CONTROL_DOWN = false
  let OLD_COMMANDS: Commands = []
  let FULL_SCREEN = false
  let APP_NAME: string | null = null
  let APP_STATE: AppState = {}
  let UP_MAPPING = standardUp
  let DOWN_MAPPING = standardDown
  let PRECARET = ''
  let CARET = DASH
  let POSTCARET = ''
  let CARET_ACTIVE = false
  let USER = 'guest'
  let PWD = '/home/guest'

  /* below this point is messy */
  // TODO let init handle user and pwd
  // TODO whoami and login
  // TODO make state into an object and do { ...state }
  const handleUp = (e: KeyboardEvent) => {
    const {
      controlDown,
      oldCommands,
      precaret,
      caret,
      postcaret,
      caretActive,
      pwd,
    } = UP_MAPPING({ e, s: {
        controlDown: CONTROL_DOWN,
        oldCommands: OLD_COMMANDS,
        fullScreen: FULL_SCREEN,
        appName: APP_NAME,
        appState: APP_STATE,
        precaret: PRECARET,
        caret: CARET,
        postcaret: POSTCARET,
        caretActive: CARET_ACTIVE,
        pwd: PWD,
      }
    })
    CONTROL_DOWN = controlDown
    OLD_COMMANDS = oldCommands
    PRECARET = precaret
    CARET = caret
    POSTCARET = postcaret
    CARET_ACTIVE = caretActive
    PWD = pwd
  }

  const handleDown = (e: KeyboardEvent) => {
    const { controlDown } = DOWN_MAPPING({ e, s: { controlDown: CONTROL_DOWN } })
    CONTROL_DOWN = controlDown
  }

  window.onload = () => {
    // TODO better logging
    console.log('initalizing')
    init()
  }
</script>

<div>
  <!-- TODO standardize prop names -->
  {#if !FULL_SCREEN}
    <History oldCmds={OLD_COMMANDS} />
    <Prompt pwd={PWD} usr={USER}>
      <Caret precaret={PRECARET} caret={CARET} postcaret={POSTCARET} caretActive={CARET_ACTIVE} />
    </Prompt>
  {:else}
    <FullScreen appName={APP_NAME} appState={APP_STATE} />
  {/if}
  <!-- svelte-ignore a11y-autofocus -->
  <input autofocus on:keydown={handleDown} on:keyup={handleUp} on:blur={refocus} />
</div>

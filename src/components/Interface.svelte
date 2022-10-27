<style>
  input {
    left: -1000px;
    position: absolute;
  }

  .caret-empty {
    animation: empty 1s step-end infinite;
    color: transparent;
  }

  .caret-full {
    animation: full 1s step-end infinite;
    color: #fff;
  }

  @keyframes empty {
    50% {
      background-color: #fff;
    }
  }

  @keyframes full {
    50% {
      background-color: #fff;
      color: #000;
    }
  }
</style>

<script lang="ts">
  import { writable } from 'svelte/store'

  import Prompt from './Prompt.svelte'
  import History from './History.svelte'

  import { evaluate, init } from '../lib/sh'
  import { getEnv } from '../lib/fs'
  import { EMPTY, DASH } from '../lib/constants'

  import type { Commands } from 'src/lib/types'

  // TODO figure out a better way to rerender this
  const pwd = writable('/home/guest')

  window.onload = () => {
    console.log('initalizing')
    init()
  }

  /* history */
  let prevCmd = 0
  let oldCmds: Commands = []

  /* line state */
  let precaret = ''
  let caret = DASH
  let postcaret = ''
  let caretClass = 'caret-empty'

  /* state */
  let CONTROL_DOWN = false
  // TODO whoami and login
  let user = 'guest'
  let FULL_SCREEN = false

  const clearLine = () => {
    precaret = postcaret = EMPTY
    caret = DASH
    prevCmd = 0
    caretClass = 'caret-empty'
  }

  const up = ({ key }: KeyboardEvent) => {
    console.log({ key })

    /* check for ctl codes */
    if (CONTROL_DOWN) {
      switch (key) {
        case 'l':
          oldCmds = []
          clearLine()
          return
        case 'Control':
          CONTROL_DOWN = false
          return
        default:
          return
      }
    }

    switch (key) {
      case 'Enter': {
        const cmd = caret === DASH ? `${precaret}${postcaret}` : `${precaret}${caret}${postcaret}`
        const wd = getEnv('PWD')
        const stdout = evaluate(cmd)
        pwd.update(() => getEnv('PWD'))
        oldCmds = [...oldCmds, { cmd, stdout, wd, usr: user }]
        clearLine()
        return
      }
      case 'ArrowLeft': {
        if (precaret === EMPTY) return
        const lastIndex = precaret.length - 1
        const last = precaret[lastIndex]
        precaret = precaret.slice(0, lastIndex)
        postcaret = caret === DASH ? EMPTY : `${caret}${postcaret}`
        caret = last
        caretClass = 'caret-full'
        return
      }
      case 'ArrowUp': {
        postcaret = EMPTY
        caret = DASH
        const history = oldCmds.filter((c) => c.cmd !== EMPTY).reverse()
        if (prevCmd < history.length) {
          precaret = history[prevCmd].cmd
          prevCmd += 1
        }
        return
      }
      case 'ArrowDown': {
        postcaret = EMPTY
        caret = DASH
        const history = oldCmds.filter((c) => c.cmd !== EMPTY).reverse()
        if (prevCmd > -1) {
          prevCmd -= 1
        }
        precaret = prevCmd === -1 ? EMPTY : history[prevCmd].cmd
        if (prevCmd === -1) prevCmd = 0
        return
      }
      case 'ArrowRight': {
        if (postcaret === EMPTY) {
          if (caret !== DASH) {
            precaret = `${precaret}${caret}`
          }
          caret = DASH
          caretClass = 'caret-empty'
          return
        }
        const first = postcaret[0]
        precaret = `${precaret}${caret}`
        caret = first
        postcaret = postcaret.slice(1, postcaret.length)
        return
      }
      case 'Backspace': {
        precaret = precaret.slice(0, precaret.length - 1)
        return
      }
      case 'Shift':
      case 'Tab':
        return
      default: {
        precaret += key
      }
    }
  }

  const down = ({ key }: KeyboardEvent) => {
    switch (key) {
      case 'Control':
        CONTROL_DOWN = true
        return
      default:
        return
    }
  }

  const refocus = (e: Event) => window.setTimeout(() => (e.target as HTMLInputElement).focus(), 0)

  // TODO multiline stdout
  // TODO history component
  // TODO full pane apps
</script>

<div>
  {#if !FULL_SCREEN}
    <History {oldCmds} />
    <Prompt pwd={$pwd} usr={user}>
      {precaret}<span class={caretClass}>{caret}</span>{postcaret}
    </Prompt>
    <!-- svelte-ignore a11y-autofocus -->
    <input autofocus on:keydown={down} on:keyup={up} on:blur={refocus} />
  {:else}
    <div>Full Screen</div>
  {/if}
</div>

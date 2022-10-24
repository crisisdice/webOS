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
  import Prompt from './Prompt.svelte'

  const EMPTY = ''
  const DASH = '_'

  let oldCmds: { cmd: string; output: string } = []
  let precaret = ''
  let caret = DASH
  let postcaret = ''
  let caretClass = 'caret-empty'
  let shifted = false
  let controlled = false
  let prevCmd = 0

  const echo = (args: string) => {
    return args.replaceAll('"', '')
  }

  const evaluate = (input: string) => {
    if (input === EMPTY) return

    const cmds = {
      echo: echo,
    }

    // TODO command parsing
    const cmd = input.split(' ')?.[0] ?? input

    const args = input.slice(input.indexOf(' '))

    if (!cmds[cmd]) return `sh: command not found: ${cmd}`

    return cmds[cmd](args)
  }

  const up = ({ keyCode }: KeyboardEvent) => {
    console.log({ keyCode })
    switch (keyCode) {
      /* enter */
      case 13: {
        const cmd = caret === DASH ? `${precaret}${postcaret}` : `${precaret}${caret}${postcaret}`
        oldCmds = [...oldCmds, { cmd, output: evaluate(cmd) }]
        precaret = postcaret = EMPTY
        caret = DASH
        prevCmd = 0
        return
      }
      /* left */
      case 37: {
        if (precaret === EMPTY) return
        const lastIndex = precaret.length - 1
        const last = precaret[lastIndex]
        precaret = precaret.slice(0, lastIndex)
        postcaret = caret === DASH ? EMPTY : `${caret}${postcaret}`
        caret = last
        caretClass = 'caret-full'
        return
      }
      /* up */
      case 38: {
        postcaret = EMPTY
        caret = DASH
        const history = oldCmds.filter((c) => c.cmd !== EMPTY).reverse()
        if (prevCmd < history.length) {
          precaret = history[prevCmd].cmd
          prevCmd += 1
        }
        return
      }
      /* down */
      case 40: {
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
      /* right */
      case 39: {
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
      /* delete */
      case 8: {
        precaret = precaret.slice(0, precaret.length - 1)
        return
      }
      default: {
        if (controlled) {
          if (keyCode === 76) {
            oldCmds = []
            precaret = postcaret = EMPTY
            caret = DASH
            return
          }
        }

        if (keyCode === 17) {
          controlled = false
        }

        // TODO improve keyboard parsing
        if (keyCode > 31) {
          precaret +=
            keyCode === 222
              ? shifted
                ? '"'
                : "'"
              : keyCode > 64 && keyCode <= 90
              ? String.fromCharCode(shifted ? keyCode : keyCode + 32)
              : String.fromCharCode(keyCode)
        }

        if (keyCode === 16) {
          shifted = false
        }
      }
    }
  }

  const down = ({ keyCode }: KeyboardEvent) => {
    switch (keyCode) {
      /* shift */
      case 16:
        shifted = true
        return
      case 17:
        controlled = true
        return
      default:
        return
    }
  }
</script>

<div>
  {#each oldCmds as oldCmd}
    <Prompt>{oldCmd.cmd}</Prompt>
    {#if oldCmd.output}<span>{oldCmd.output}</span>{/if}
  {/each}
  <Prompt>
    {precaret}<span class={caretClass}>{caret}</span>{postcaret}
  </Prompt>
  <input
    autofocus
    on:keydown={down}
    on:keyup={up}
    on:blur={(e) => window.setTimeout(() => e.target.focus(), 0)}
  />
</div>

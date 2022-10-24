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

  let oldCmds: { cmd: string; wd: string; stdout: string }[] = []
  let precaret = ''
  let caret = DASH
  let postcaret = ''
  let caretClass = 'caret-empty'
  let CONTROL_DOWN = false
  let prevCmd = 0

  let pwd = '/home/guest'

  let structure = {
    'home': {
      'guest': {
        '.bashrc': '#!/usr/sh',
        '.history': ''
      },
      'root': {}
    }
  }

  let user = 'guest'
  let pwdObj = structure['home'][user]

  const echo = (args: string) => {
    return args.replaceAll('"', '')
  }

  const ls = () => {
    return Object.keys(pwdObj).join(' ')
  }

  const cat = (arg: string) => {
    const stat = () => {
      if (!Object.keys(pwdObj).find(k => k === arg)) return `cat : ${arg}: No such file or directory`
      return pwdObj[arg]
    }
    const file = stat()
    return (typeof file === 'string') 
      ? file
      : `cat: ${arg}: Is a directory`
  }

  const mkdir = (arg: string) => {
    if (!!pwdObj[arg]) return `mkdir: ${arg}: File exists`
    pwdObj[arg] = {}
    return
  }

  const cd = (args: string) => {
    if (args === EMPTY || args === '~') {
      pwdObj = structure['home'][user]
      pwd = `/home/${user}`
      return
    }

    if (args === '/') {
      pwd = '/'
      pwdObj = structure
      return
    }

    let steps = args[0] === '/' ? args.split('/') : `${pwd === '/' ? '' : pwd }/${args}`.split('/')
    let tmp = structure

    if (args === '..') {
      // TODO all relative
      const pwdTmp = pwd.split('/')
      steps = pwdTmp.slice(0, pwdTmp.length - 1)
    }

    for (const step of steps) {
      if (step === "") continue
      tmp = tmp[step]
      if (!tmp) return `cd: no such file or directory: ${args}`
    }

    pwdObj = tmp
    pwd = (steps.length === 1 && steps[0] === "") || steps.length === 0 ? '/' : steps.join('/')
  }

  const evaluate = (input: string) => {
    if (input === EMPTY) return

    const cmds = {
      echo,
      cd,
      ls,
      pwd: 'dummy',
      cat,
      mkdir
    }

    // TODO command parsing
    const cmd = (input.split(' ')?.[0] ?? input).trim()

    const argsI = input.indexOf(' ')
    const args = argsI === -1 ? EMPTY : input.slice(argsI + 1)

    if (!cmds[cmd]) return `sh: command not found: ${cmd}`

    if (cmd === 'pwd') return `${pwd}/`

    return cmds[cmd](args)
  }

  const up = ({ key }: KeyboardEvent) => {
    console.log({ key })

    /* check for ctl codes */
    if (CONTROL_DOWN) {
      switch (key) {
        case "l":
          oldCmds = []
          precaret = postcaret = EMPTY
          caret = DASH
          return
        case "Control":
          CONTROL_DOWN = false
          return
        default:
          return
      }
    }

    switch (key) {
      case "Enter": {
        const cmd = caret === DASH ? `${precaret}${postcaret}` : `${precaret}${caret}${postcaret}`
        const wd = pwd
        oldCmds = [...oldCmds, { cmd, stdout: evaluate(cmd), wd }]
        precaret = postcaret = EMPTY
        caret = DASH
        prevCmd = 0
        return
      }
      case "ArrowLeft": {
        if (precaret === EMPTY) return
        const lastIndex = precaret.length - 1
        const last = precaret[lastIndex]
        precaret = precaret.slice(0, lastIndex)
        postcaret = caret === DASH ? EMPTY : `${caret}${postcaret}`
        caret = last
        caretClass = 'caret-full'
        return
      }
      case "ArrowUp": {
        postcaret = EMPTY
        caret = DASH
        const history = oldCmds.filter((c) => c.cmd !== EMPTY).reverse()
        if (prevCmd < history.length) {
          precaret = history[prevCmd].cmd
          prevCmd += 1
        }
        return
      }
      case "ArrowDown": {
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
      case "ArrowRight": {
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
      case "Backspace": {
        precaret = precaret.slice(0, precaret.length - 1)
        return
      }
      case "Shift":
      case "Tab":
        return
      default: {
        precaret += key
      }
    }
  }

  const down = ({ key }: KeyboardEvent) => {
    switch (key) {
      case "Control":
        CONTROL_DOWN = true
        return
      default:
        return
    }
  }

  const refocus = (e: Event) => window.setTimeout(() => (e.target as HTMLInputElement).focus(), 0)
</script>

<div>
  {#each oldCmds as oldCmd}
    <Prompt pwd={oldCmd.wd} usr={user}>{oldCmd.cmd}</Prompt>
    {#if oldCmd.stdout}<span>{oldCmd.stdout}</span>{/if}
  {/each}
  <Prompt pwd={pwd} usr={user}>
    {precaret}<span class={caretClass}>{caret}</span>{postcaret}
  </Prompt>
  <!-- svelte-ignore a11y-autofocus -->
  <input
    autofocus
    on:keydown={down}
    on:keyup={up}
    on:blur={refocus}
  />
</div>

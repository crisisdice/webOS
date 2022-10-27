// /* key mappings */
// export const viUp = ({ key }: KeyboardEvent) => {
//   console.log({ key, APP_NAME, mapping: 'vi' })
//
//   switch (key) {
//     case 'q': {
//       FULL_SCREEN = false
//       APP_NAME = null
//       UP_MAPPING = standardUp
//       return
//     }
//     default: {
//       console.log('default')
//       return
//     }
//   }
// }

import type { APPSTATE } from '../lib/types'
import { EMPTY, DASH, PWD } from '../lib/constants'
import { getEnv } from '../lib/fs'
import { evaluate } from '../lib/sh'

export const standardUp = ({
  e: { key },
  s: { controlDown, oldCommands, precaret, caret, postcaret, caretActive, pwd },
}: {
  e: KeyboardEvent
  s: Omit<APPSTATE, 'upMapping' | 'downMapping'>
}) => {
  console.log({ key, mapping: 'standard' })

  const clearLine = () => {
    precaret = postcaret = EMPTY
    caret = DASH
    // TODO fix history
    // prevCmd = 0
    caretActive = false
  }

  /* check for ctl codes */
  if (controlDown) {
    switch (key) {
      case 'l':
        oldCommands = []
        clearLine()
        break
      case 'Control':
        controlDown = false
        break
      default:
        break
    }

    return { controlDown, oldCommands, precaret, caret, postcaret, caretActive, pwd }
  }

  switch (key) {
    case 'Enter': {
      const cmd = caret === DASH ? `${precaret}${postcaret}` : `${precaret}${caret}${postcaret}`
      const wd = getEnv(PWD)

      // TODO tokenize command here

      /* full screen apps */
      // if (['vi'].includes(cmd)) {
      //   FULL_SCREEN = true
      //   APP_NAME = cmd
      //   oldCmds = [...oldCmds, { cmd, stdout: null, wd, usr: user }]
      //   UP_MAPPING = viUp
      //   clearLine()
      //   break
      // }

      const stdout = evaluate(cmd)
      // TODO user
      oldCommands = [...oldCommands, { cmd, stdout, wd, usr: 'guest' }]

      pwd = getEnv(PWD)

      clearLine()
      break
    }
    case 'ArrowLeft': {
      if (precaret === EMPTY) break
      const lastIndex = precaret.length - 1
      const last = precaret[lastIndex]
      precaret = precaret.slice(0, lastIndex)
      postcaret = caret === DASH ? EMPTY : `${caret}${postcaret}`
      caret = last
      caretActive = true
      break
    }
    // TODO
    // case 'ArrowUp': {
    //   postcaret = EMPTY
    //   caret = DASH
    //   const history = oldCmds.filter((c) => c.cmd !== EMPTY).reverse()
    //   if (prevCmd < history.length) {
    //     precaret = history[prevCmd].cmd
    //     prevCmd += 1
    //   }
    //   break
    // }
    // case 'ArrowDown': {
    //   postcaret = EMPTY
    //   caret = DASH
    //   const history = oldCmds.filter((c) => c.cmd !== EMPTY).reverse()
    //   if (prevCmd > -1) {
    //     prevCmd -= 1
    //   }
    //   precaret = prevCmd === -1 ? EMPTY : history[prevCmd].cmd
    //   if (prevCmd === -1) prevCmd = 0
    //   break
    // }
    case 'ArrowRight': {
      if (postcaret === EMPTY) {
        if (caret !== DASH) {
          precaret = `${precaret}${caret}`
        }
        caret = DASH
        caretActive = false
        break
      }
      const first = postcaret[0]
      precaret = `${precaret}${caret}`
      caret = first
      postcaret = postcaret.slice(1, postcaret.length)
      break
    }
    case 'Backspace': {
      precaret = precaret.slice(0, precaret.length - 1)
      break
    }
    case 'Shift':
    case 'Tab':
      break
    default: {
      precaret += key
    }
  }

  return { controlDown, oldCommands, precaret, caret, postcaret, caretActive, pwd }
}

export const standardDown = ({
  e: { key },
  s: { controlDown },
}: {
  e: KeyboardEvent
  s: { controlDown: boolean }
}) => {
  switch (key) {
    case 'Control':
      controlDown = true
      break
    default:
      break
  }

  return { controlDown }
}

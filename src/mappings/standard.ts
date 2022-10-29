import { viUp } from './index'
import { EMPTY, DASH } from '../lib/constants'
import { getEnv } from '../lib/fs'
import { evaluate } from '../lib/sh'
import type { State } from '../lib/types'

export const standardUp = ({
  e: { key },
  STATE,
  STATE: {
    FULL_SCREEN,
    APP_NAME,
    CONTROL_DOWN,
    OLD_COMMANDS,
    UP_MAPPING,
    USER,
    PRECARET,
    CARET,
    POSTCARET,
    CARET_ACTIVE,
    PWD,
  },
}: {
  e: KeyboardEvent
  STATE: State
}): State => {
  console.log({ key, mapping: 'sh', STATE })

  const clearLine = () => {
    PRECARET = POSTCARET = EMPTY
    CARET = DASH
    // TODO fix history
    // prevCmd = 0
    CARET_ACTIVE = false
  }

  /* check for ctl codes */
  if (CONTROL_DOWN) {
    switch (key) {
      case 'l':
        OLD_COMMANDS = []
        clearLine()
        break
      case 'Control':
        CONTROL_DOWN = false
        break
      default:
        break
    }

    return { ...STATE, CONTROL_DOWN, OLD_COMMANDS, PRECARET, CARET, POSTCARET, CARET_ACTIVE, PWD }
  }

  switch (key) {
    case 'Enter': {
      const cmd = CARET === DASH ? `${PRECARET}${POSTCARET}` : `${PRECARET}${CARET}${POSTCARET}`
      const wd = getEnv('PWD')

      // TODO tokenize command here

      /* full screen apps */
      if (['vi'].includes(cmd)) {
        FULL_SCREEN = true
        APP_NAME = cmd
        OLD_COMMANDS = [...OLD_COMMANDS, { cmd, stdout: null, wd, usr: USER }]
        UP_MAPPING = viUp
        clearLine()
        break
      }

      const stdout = evaluate(cmd)
      // TODO user
      OLD_COMMANDS = [...OLD_COMMANDS, { cmd, stdout, wd, usr: 'guest' }]

      PWD = getEnv('PWD')

      clearLine()
      break
    }
    case 'ArrowLeft': {
      if (PRECARET === EMPTY) break
      const lastIndex = PRECARET.length - 1
      const last = PRECARET[lastIndex]
      PRECARET = PRECARET.slice(0, lastIndex)
      POSTCARET = CARET === DASH ? EMPTY : `${CARET}${POSTCARET}`
      CARET = last
      CARET_ACTIVE = true
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
      if (POSTCARET === EMPTY) {
        if (CARET !== DASH) {
          PRECARET = `${PRECARET}${CARET}`
        }
        CARET = DASH
        CARET_ACTIVE = false
        break
      }
      const first = POSTCARET[0]
      PRECARET = `${PRECARET}${CARET}`
      CARET = first
      POSTCARET = POSTCARET.slice(1, POSTCARET.length)
      break
    }
    case 'Backspace': {
      PRECARET = PRECARET.slice(0, PRECARET.length - 1)
      break
    }
    case 'Shift':
    case 'Tab':
      break
    default: {
      PRECARET += key
    }
  }

  return {
    ...STATE,
    FULL_SCREEN,
    APP_NAME,
    CONTROL_DOWN,
    OLD_COMMANDS,
    UP_MAPPING,
    PRECARET,
    CARET,
    POSTCARET,
    CARET_ACTIVE,
    PWD,
  }
}

export const standardDown = ({
  e: { key },
  STATE,
  STATE: { CONTROL_DOWN },
}: {
  e: KeyboardEvent
  STATE: State
}): State => {
  switch (key) {
    case 'Control':
      CONTROL_DOWN = true
      break
    default:
      break
  }

  return { ...STATE, CONTROL_DOWN }
}

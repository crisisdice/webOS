import { viUp } from './index'
import { EMPTY, DASH } from '../lib/constants'
import { getEnv } from '../lib/fs'
import { evaluate } from '../lib/sh'
import type { State } from '../lib/types'
import { VI_MODE } from '../lib/vi/state'

export const standardUp = ({
  e: { key },
  STATE,
  STATE: {
    FULL_SCREEN,
    APP_NAME,
    APP_STATE,
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
      // TODO tokenize command here
      const cmd = CARET === DASH ? `${PRECARET}${POSTCARET}` : `${PRECARET}${CARET}${POSTCARET}`
      const wd = getEnv('PWD')

      /* full screen apps */
      if (['vi'].includes(cmd)) {
        FULL_SCREEN = true
        APP_NAME = cmd
        OLD_COMMANDS = [...OLD_COMMANDS, { cmd, stdout: null, wd, usr: USER }]
        UP_MAPPING = viUp
        APP_STATE = {
          MODE: VI_MODE.VISUAL,
          COMMAND_LINE: {
            PRECARET: '',
            CARET: DASH,
            POSTCARET: '',
            CARET_ACTIVE: false,
          },
          LINE: {
            PRECARET: '',
            CARET: DASH,
            POSTCARET: '',
            CARET_ACTIVE: false,
          },
          BUFFER: [],
          BUFFER_PRE: [],
          BUFFER_POST: [],
          COORDS: { x: 0, y: 0 },
        }
        clearLine()
        break
      }

      OLD_COMMANDS = [...OLD_COMMANDS, { cmd, stdout: evaluate(cmd), wd, usr: USER }]
      PWD = getEnv('PWD')
      clearLine()
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
    case 'ArrowLeft': {
      if (PRECARET === EMPTY) break
      POSTCARET = CARET === DASH ? EMPTY : `${CARET}${POSTCARET}`
      CARET = PRECARET.at(-1)
      PRECARET = PRECARET.slice(0, PRECARET.length - 1)
      CARET_ACTIVE = true
      break
    }
    case 'ArrowRight': {
      if (CARET === DASH) break
      PRECARET = `${PRECARET}${CARET}`
      CARET = POSTCARET === EMPTY ? DASH : POSTCARET[0]
      POSTCARET = POSTCARET.slice(1, POSTCARET.length)
      CARET_ACTIVE = !(POSTCARET === EMPTY && CARET === DASH)
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
    APP_STATE,
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

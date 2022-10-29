import { viUp } from './index'
import { EMPTY, DASH } from '../lib/constants'
import { getEnv } from '../lib/fs'
import { evaluate } from '../lib/sh'
import type { State } from '../lib/types'
import { VI_MODE } from '../lib/vi/state'
import { shiftLeft, shiftRight } from './shift'
import { EMPTY_LINE } from '../state'

export const standardUp = ({
  e: { key },
  STATE,
  STATE: {
    APP_STATE,
    APP_STATE: { CONTROL_DOWN },
    OLD_COMMANDS,
    USER,
    COMMAND_LINE,
    COMMAND_LINE: { PRECARET, CARET, POSTCARET },
    PWD,
  },
}: {
  e: KeyboardEvent
  STATE: State
}): State => {
  console.log({ key, mapping: 'sh', STATE })

  /* check for ctl codes */
  if (CONTROL_DOWN) {
    switch (key) {
      case 'l':
        OLD_COMMANDS = []
        COMMAND_LINE = { ...EMPTY_LINE }
        break
      case 'Control':
        CONTROL_DOWN = false
        break
      default:
        break
    }

    return { ...STATE, APP_STATE: { ...APP_STATE, CONTROL_DOWN }, OLD_COMMANDS, COMMAND_LINE, PWD }
  }

  switch (key) {
    case 'Enter': {
      // TODO tokenize command here
      const cmd = CARET === DASH ? `${PRECARET}${POSTCARET}` : `${PRECARET}${CARET}${POSTCARET}`
      const wd = getEnv('PWD')

      /* full screen apps */
      if (['vi'].includes(cmd)) {
        OLD_COMMANDS = [...OLD_COMMANDS, { cmd, stdout: null, wd, usr: USER }]
        APP_STATE = {
          ...APP_STATE,
          FULL_SCREEN: true,
          NAME: 'vi',
          UP_MAPPING: viUp,
          MODE: VI_MODE.VISUAL,
          COMMAND_LINE: { ...EMPTY_LINE },
          LINE: { ...EMPTY_LINE },
          BUFFER: [],
          BUFFER_PRE: [],
          BUFFER_POST: [],
          COORDS: { x: 0, y: 0 },
        }
        COMMAND_LINE = { ...EMPTY_LINE }
        return { ...STATE, APP_STATE, OLD_COMMANDS, COMMAND_LINE }
      }

      OLD_COMMANDS = [...OLD_COMMANDS, { cmd, stdout: evaluate(cmd), wd, usr: USER }]
      PWD = getEnv('PWD')
      COMMAND_LINE = EMPTY_LINE
      return { ...STATE, APP_STATE, OLD_COMMANDS, COMMAND_LINE, PWD }
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
      COMMAND_LINE = shiftLeft(COMMAND_LINE)
      break
    }
    case 'ArrowRight': {
      if (CARET === DASH) break
      COMMAND_LINE = shiftRight(COMMAND_LINE)
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
    APP_STATE,
    OLD_COMMANDS,
    COMMAND_LINE: {
      ...COMMAND_LINE,
      PRECARET,
    },
    PWD,
  }
}

export const standardDown = ({
  e: { key },
  STATE,
  STATE: {
    APP_STATE,
    APP_STATE: { CONTROL_DOWN },
  },
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

  return { ...STATE, APP_STATE: { ...APP_STATE, CONTROL_DOWN } }
}

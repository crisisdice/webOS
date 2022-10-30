import type { KeyMapping, ShellState, VimAppState } from '../types'
import { viUp } from './index'
import { DASH, EMPTY_LINE } from '../utils'
import { getEnv, evaluate, VI_MODE } from '../lib'
import { shiftLeft, shiftRight } from './shift'

export const standardUp: KeyMapping = ({ e: { key }, STATE }) => {
  const { USER } = STATE as ShellState

  let { CONTROL_DOWN, OLD_COMMANDS, COMMAND_LINE, PWD } = STATE as ShellState

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

    return { ...STATE, CONTROL_DOWN, OLD_COMMANDS, COMMAND_LINE }
  }

  let { PRECARET } = COMMAND_LINE

  switch (key) {
    case 'Enter': {
      // TODO tokenize command here
      const { CARET, POSTCARET } = COMMAND_LINE
      const cmd = CARET === DASH ? `${PRECARET}${POSTCARET}` : `${PRECARET}${CARET}${POSTCARET}`
      const wd = getEnv('PWD')

      /* full screen apps */
      if (['vi'].includes(cmd)) {
        OLD_COMMANDS = [...OLD_COMMANDS, { cmd, stdout: null, wd, usr: USER }]
        return {
          ...STATE,
          FULL_SCREEN: true,
          NAME: 'vi',
          UP_MAPPING: viUp,
          MODE: VI_MODE.VISUAL,
          COMMAND_LINE: { ...EMPTY_LINE },
          BUFFER: {
            LINE: { ...EMPTY_LINE },
            BUFFER_PRE: [],
            BUFFER_POST: [],
          },
          COORDS: { x: 0, y: 0 },
        } as VimAppState
      }

      OLD_COMMANDS = [...OLD_COMMANDS, { cmd, stdout: evaluate(cmd), wd, usr: USER }]
      PWD = getEnv('PWD')
      COMMAND_LINE = EMPTY_LINE
      return { ...STATE, OLD_COMMANDS, COMMAND_LINE, PWD }
    }
    // TODO history mode
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
      COMMAND_LINE = shiftLeft({ LINE: COMMAND_LINE })
      return { ...STATE, COMMAND_LINE }
    }
    case 'ArrowRight': {
      COMMAND_LINE = shiftRight({ LINE: COMMAND_LINE })
      return { ...STATE, COMMAND_LINE }
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
    OLD_COMMANDS,
    COMMAND_LINE: {
      ...COMMAND_LINE,
      PRECARET,
    },
    PWD,
  }
}

export const standardDown: KeyMapping = ({ e: { key }, STATE }) => {
  let { CONTROL_DOWN } = STATE
  switch (key) {
    case 'Control':
      CONTROL_DOWN = true
      break
    default:
      break
  }

  return { ...STATE, CONTROL_DOWN }
}

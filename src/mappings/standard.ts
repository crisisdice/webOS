import type { KeyMapping, ShellState, VimAppState } from '../types'
import { viUp } from './index'
import { EMPTY_LINE, lineToString, parseCmd, fileToBuffer, EMPTY, stringToLine } from '../utils'
import { getEnv, evaluate, VI_MODE } from '../lib'
import { shiftLeft, shiftRight } from './shift'

export const standardUp: KeyMapping = ({ e: { key }, STATE }) => {
  const { USER } = STATE as ShellState

  let { CONTROL_DOWN, OLD_COMMANDS, COMMAND_LINE, HISTORY_INDEX } = STATE as ShellState

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
      const commandTokens = parseCmd(COMMAND_LINE)
      const cmd = commandTokens?.[0] ?? ''
      const args = commandTokens.slice(1)

      /* full screen apps */
      if (['vi'].includes(cmd)) {
        //OLD_COMMANDS = [...OLD_COMMANDS, { cmd, stdout: null, wd, usr: USER }]

        return {
          ...STATE,
          ...fileToBuffer(args?.[0]),
          FULL_SCREEN: true,
          NAME: 'vi',
          UP_MAPPING: viUp,
          MODE: VI_MODE.VISUAL,
          COMMAND_LINE: { ...EMPTY_LINE },
          COORDS: { x: 0, y: 0 },
        } as VimAppState
      }

      const wd = getEnv('PWD')
      OLD_COMMANDS = [
        ...OLD_COMMANDS,
        { cmd: lineToString(COMMAND_LINE), stdout: evaluate(cmd, args), wd, usr: USER },
      ]
      return { ...STATE, OLD_COMMANDS, COMMAND_LINE: EMPTY_LINE, PWD: getEnv('PWD') }
    }
    case 'ArrowUp': {
      const history = OLD_COMMANDS.filter((c) => c.cmd !== EMPTY).reverse()
      if (HISTORY_INDEX < history.length - 1) {
        HISTORY_INDEX += 1
      }
      return {
        ...STATE,
        HISTORY_INDEX,
        COMMAND_LINE: history.length ? stringToLine(history[HISTORY_INDEX].cmd, 0) : EMPTY_LINE,
      }
    }
    case 'ArrowDown': {
      const history = OLD_COMMANDS.filter((c) => c.cmd !== EMPTY).reverse()
      if (HISTORY_INDEX > -1) {
        HISTORY_INDEX -= 1
      }
      return {
        ...STATE,
        HISTORY_INDEX,
        COMMAND_LINE:
          HISTORY_INDEX === -1 ? EMPTY_LINE : stringToLine(history[HISTORY_INDEX].cmd, 0),
      }
    }
    case 'ArrowLeft': {
      return { ...STATE, COMMAND_LINE: shiftLeft({ LINE: COMMAND_LINE }) }
    }
    case 'ArrowRight': {
      return { ...STATE, COMMAND_LINE: shiftRight({ LINE: COMMAND_LINE }) }
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
    COMMAND_LINE: {
      ...COMMAND_LINE,
      PRECARET,
    },
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

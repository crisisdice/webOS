import type { KeyMapping, ShellState } from '../types'
import { EMPTY_LINE, EMPTY, lineToString } from '../utils'
import { evaluate } from '../lib'
import { shiftLeft, shiftRight } from './shift'

export const standardUp: KeyMapping = ({ e: { key }, STATE }) => {
  const { CONTROL_DOWN, OLD_COMMANDS, COMMAND_LINE } = STATE as ShellState
  let { HISTORY_INDEX } = STATE as ShellState
  let { PRECARET } = COMMAND_LINE

  if (CONTROL_DOWN) {
    switch (key) {
      case 'l':
        return { ...STATE, OLD_COMMANDS: [], COMMAND_LINE: EMPTY_LINE }
      case 'Control':
        return { ...STATE, CONTROL_DOWN: false }
      default:
        return STATE
    }
  }

  switch (key) {
    case 'Enter':
      return evaluate({ STATE } as { STATE: ShellState })
    case 'ArrowUp': {
      const history = OLD_COMMANDS.filter(
        ({ COMMAND_LINE }) => lineToString(COMMAND_LINE) !== EMPTY,
      ).reverse()
      if (HISTORY_INDEX < history.length - 1) {
        HISTORY_INDEX += 1
      }
      return {
        ...STATE,
        HISTORY_INDEX,
        COMMAND_LINE: history.length ? history[HISTORY_INDEX] : { ...EMPTY_LINE },
      } as ShellState
    }
    case 'ArrowDown': {
      const history = OLD_COMMANDS.filter(
        ({ COMMAND_LINE }) => lineToString(COMMAND_LINE) !== EMPTY,
      ).reverse()
      if (HISTORY_INDEX > -1) {
        HISTORY_INDEX -= 1
      }
      return {
        ...STATE,
        HISTORY_INDEX,
        COMMAND_LINE: HISTORY_INDEX === -1 ? { ...EMPTY_LINE } : history[HISTORY_INDEX],
      } as ShellState
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
  switch (key) {
    case 'Control':
      return { ...STATE, CONTROL_DOWN: true }
    default:
      return STATE
  }
}

import type { KeyMapping, ShellState } from '../../types'
import { EMPTY_LINE } from '../../utils'
import { evaluate } from './evaluate'
import { shiftLeft, shiftRight } from '../shift'
import { historyDown, historyUp } from './history'

export const shellUp: KeyMapping = ({
  e: { key },
  STATE,
  STATE: { CONTROL_DOWN, COMMAND_LINE },
}: {
  e: KeyboardEvent
  STATE: ShellState
}) => {
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
      return evaluate({ STATE })
    case 'ArrowUp':
      return historyUp({ STATE })
    case 'ArrowDown':
      return historyDown({ STATE })
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

export const shellDown: KeyMapping = ({ e: { key }, STATE }) => {
  switch (key) {
    case 'Control':
      return { ...STATE, CONTROL_DOWN: true }
    default:
      return STATE
  }
}

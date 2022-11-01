import type { KeyMapping, ViState } from '../../types'
import { vimCommands } from './utils'
import { EMPTY_LINE } from '../../utils'
import { del, shiftLeft, shiftRight } from '../shift'
import { VI_MODE } from './constants'

export const processCommandMode: KeyMapping = ({ e: { key }, STATE }) => {
  const { COMMAND_LINE } = STATE as ViState
  let { PRECARET } = COMMAND_LINE

  switch (key) {
    case '`': {
      console.log({ MODE: 'VISUAL' })
      return { ...STATE, COMMAND_LINE: { ...EMPTY_LINE }, MODE: VI_MODE.VISUAL }
    }
    case 'Enter':
      return vimCommands(STATE as ViState)
    case 'ArrowLeft':
      return { ...STATE, COMMAND_LINE: shiftLeft({ LINE: COMMAND_LINE }) }
    case 'ArrowRight':
      return { ...STATE, COMMAND_LINE: shiftRight({ LINE: COMMAND_LINE }) }
    case 'ArrowUp':
    case 'ArrowDown':
    case 'Alt':
    case 'Shift':
    case 'Tab':
      break
    case 'Backspace': {
      PRECARET = del(PRECARET)
      break
    }
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

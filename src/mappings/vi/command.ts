import type { KeyMapping, VimAppState } from '../../types'
import { VI_MODE } from '../../lib'
import { EMPTY_LINE, INITAL_STATE } from '../../utils'
import { del, shiftLeft, shiftRight } from '../shift'

export const processCommandMode: KeyMapping = ({ e: { key }, STATE }) => {
  const { COMMAND_LINE } = STATE as VimAppState
  let { PRECARET } = COMMAND_LINE

  switch (key) {
    case '`': {
      console.log({ MODE: 'VISUAL' })
      return { ...STATE, COMMAND_LINE: { ...EMPTY_LINE }, MODE: VI_MODE.VISUAL }
    }
    case 'q': {
      // TODO process as command
      // TODO figure out process numbers
      return { ...INITAL_STATE }
    }
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

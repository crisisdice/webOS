import type { KeyMapping, VimAppState } from '../../types'
import { VI_MODE } from '../../lib'
import { ARROW_KEYS, EMPTY } from '../../utils'
import { del, shiftUp, shiftDown } from '../shift'
import { processCommandMode } from './command'
import { processVisualMode } from './visual'

export const viUp: KeyMapping = ({ e: { key }, STATE }) => {
  const {
    MODE,
    BUFFER,
    COORDS,
    BUFFER: { LINE, BUFFER_POST },
  } = STATE as VimAppState

  if (MODE === VI_MODE.COMMAND) return processCommandMode({ e: { key }, STATE })
  if (MODE === VI_MODE.VISUAL || ARROW_KEYS.includes(key))
    return processVisualMode({ e: { key }, STATE })

  let { x, y } = COORDS
  let { PRECARET } = LINE

  switch (key) {
    case '`': {
      console.log({ MODE: 'VISUAL' })
      return { ...STATE, MODE: VI_MODE.VISUAL }
    }
    case 'Shift':
    case 'Alt':
    case 'Control':
    case 'Tab':
      break
    case 'Enter':
      y += 1
      return {
        ...STATE,
        ...shiftDown({
          BUFFER: { ...BUFFER, BUFFER_POST: [EMPTY, ...BUFFER_POST] },
          COORDS: { x, y },
        }),
      }
    case 'Backspace': {
      if (x === 0) {
        if (y === 0) return STATE
        y -= 1
        x = BUFFER.BUFFER_PRE.at(-1).length
        return {
          ...STATE,
          ...shiftUp({
            BUFFER: { ...BUFFER, LINE: null },
            COORDS: { x, y },
          }),
        }
      }
      x -= 1
      PRECARET = del(PRECARET)
      break
    }
    default: {
      x += 1
      PRECARET += key
    }
  }

  return {
    ...STATE,
    MODE,
    BUFFER: {
      ...BUFFER,
      LINE: {
        ...LINE,
        PRECARET,
      },
    },
    COORDS: { x, y },
  }
}

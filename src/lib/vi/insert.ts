import type { KeyMapping, ViState } from '../../types'
import { VI_MODE } from './constants'
import { EMPTY } from '../../utils'
import { del, shiftUp, shiftDown } from '../shift'

export const processInsertMode: KeyMapping = ({ e: { key }, STATE }) => {
  const {
    MODE,
    COORDS,
    COORDS: { y },
    BUFFER,
    BUFFER: { BUFFER_PRE, LINE, BUFFER_POST },
  } = STATE as ViState

  let { x } = COORDS
  let { PRECARET, CARET, POSTCARET, EOL } = LINE

  switch (key) {
    case '`': {
      console.log({ MODE: 'VISUAL' })

      if (x === 0) {
        CARET = POSTCARET?.[0] ?? null
        POSTCARET = POSTCARET.slice(1)
        EOL = CARET === null && POSTCARET === EMPTY
        return {
          ...STATE,
          BUFFER: { ...BUFFER, LINE: { CARET, PRECARET, POSTCARET, EOL, CARET_WIDTH: 1 } },
          MODE: VI_MODE.VISUAL,
        }
      }

      CARET = PRECARET.at(-1) ?? null
      PRECARET = PRECARET.slice(0, PRECARET.length - 1)
      EOL = CARET === null && POSTCARET === EMPTY

      return {
        ...STATE,
        COORDS: { x: x - 1, y },
        BUFFER: { ...BUFFER, LINE: { CARET, PRECARET, POSTCARET, EOL, CARET_WIDTH: 1 } },
        MODE: VI_MODE.VISUAL,
      }
    }
    case 'Shift':
    case 'Alt':
    case 'Control':
    case 'Tab':
    case 'Meta':
      break
    case 'Enter':
      return {
        ...STATE,
        ...shiftDown({
          BUFFER: {
            ...BUFFER,
            LINE: { ...LINE, PRECARET, CARET: null, POSTCARET: EMPTY },
            BUFFER_POST: [POSTCARET, ...BUFFER_POST],
          },
          COORDS: { x: 0, y: y + 1 },
        }),
      }
    case 'Backspace': {
      if (x === 0) {
        if (y === 0) return STATE
        const previousLine = BUFFER_PRE.at(-1)
        return {
          ...STATE,
          ...shiftUp({
            BUFFER: {
              ...BUFFER,
              BUFFER_PRE: [
                ...BUFFER_PRE.slice(0, BUFFER_PRE.length - 1),
                `${previousLine}${POSTCARET}`,
              ],
              LINE: { ...LINE, POSTCARET: EMPTY },
            },
            COORDS: { x: previousLine.length, y: y - 1 },
            DELETE: true,
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

import type { KeyMapping, ViState } from '../../types'
import { VI_MODE } from './constants'
import { EMPTY } from '../../utils'
import { del, shiftUp, shiftDown } from '../shift'

export const processInsertMode: KeyMapping = ({ e: { key }, STATE }) => {
  const {
    MODE,
    COORDS,
    BUFFER,
    BUFFER: { BUFFER_PRE, LINE, BUFFER_POST },
  } = STATE as ViState

  let { x, y } = COORDS
  let { PRECARET, CARET, POSTCARET, EOL } = LINE

  switch (key) {
    case '`': {
      console.log({ MODE: 'VISUAL' })

      CARET = x === 0 ? POSTCARET?.[0] ?? PRECARET.at(-1) ?? null : PRECARET.at(-1) ?? null
      PRECARET = x === 0 ? PRECARET : PRECARET.slice(0, PRECARET.length - 1)
      POSTCARET = x === 0 ? POSTCARET.slice(1) : POSTCARET
      EOL = CARET === null && POSTCARET === EMPTY

      x = x === 0 ? x : x - 1

      return {
        ...STATE,
        COORDS: { x, y },
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
      x = 0
      y += 1
      return {
        ...STATE,
        ...shiftDown({
          BUFFER: {
            ...BUFFER,
            LINE: { ...LINE, PRECARET, CARET: null, POSTCARET: EMPTY },
            BUFFER_POST: [POSTCARET, ...BUFFER_POST],
          },
          COORDS: { x, y },
        }),
      }
    case 'Backspace': {
      if (x === 0) {
        if (y === 0) return STATE
        y -= 1
        const previousLine = BUFFER.BUFFER_PRE.at(-1)
        x = previousLine.length
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
            COORDS: { x, y },
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

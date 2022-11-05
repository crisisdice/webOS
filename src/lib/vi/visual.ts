import type { KeyMapping, ViState } from '../../types'
import { VI_MODE } from './constants'
import { EMPTY, lineToString } from '../../utils'
import { pager } from './pager'
import { shiftDown } from '../shift'

export const processVisualMode: KeyMapping = ({ e: { key }, STATE }) => {
  const {
    BUFFER,
    COORDS,
    COORDS: { y },
    BUFFER: { LINE, BUFFER_POST },
  } = STATE as ViState

  let { x } = COORDS
  const { PRECARET, CARET, POSTCARET } = LINE
  const line = lineToString(LINE)

  switch (key) {
    case ':': {
      console.log({ MODE: 'COMMAND' })
      return { ...STATE, MODE: VI_MODE.COMMAND }
    }
    case 'O':
      console.log({ MODE: 'INSERT' })
      return {
        ...STATE,
        ...shiftDown({
          BUFFER: {
            ...BUFFER,
            LINE: { ...LINE, CARET_WIDTH: 0 },
            BUFFER_POST: [EMPTY, ...BUFFER_POST],
          },
          COORDS: { x: 0, y: y + 1 },
        }),
        MODE: VI_MODE.INSERT,
      }
    case 'A':
      console.log({ MODE: 'INSERT' })
      return {
        ...STATE,
        BUFFER: {
          ...BUFFER,
          LINE: { PRECARET: line, CARET: null, POSTCARET: EMPTY, CARET_WIDTH: 0, EOL: true },
        },
        COORDS: { x: line.length, y },
        MODE: VI_MODE.INSERT,
      }
    case '$':
      return {
        ...STATE,
        BUFFER: {
          ...BUFFER,
          LINE: { PRECARET: line, CARET: null, POSTCARET: EMPTY, CARET_WIDTH: 1, EOL: true },
        },
        COORDS: { x: line.length, y },
      }
    case '0':
      return {
        ...STATE,
        BUFFER: {
          ...BUFFER,
          // TODO refactor shift methods and refactor weird state stuff to use them
          LINE: {
            PRECARET: EMPTY,
            CARET: line?.[0] ?? null,
            POSTCARET: line.slice(1),
            CARET_WIDTH: 1,
            EOL: !line.length,
          },
        },
        COORDS: { x: 0, y },
      }
    case 'D': {
      // TODO
      return STATE
    }
    case 'd': {
      // TODO
      return STATE
    }
    case 'y': {
      // TODO
      return STATE
    }
    case 'p': {
      // TODO
      return STATE
    }
    case 'u': {
      // TODO
      return STATE
    }
    // TODO case '[1-9]':
    case 'a': {
      console.log({ MODE: 'INSERT' })
      x += 1
      return {
        ...STATE,
        COORDS: { x, y },
        BUFFER: {
          ...BUFFER,
          LINE: { ...LINE, PRECARET: `${PRECARET}${CARET ?? EMPTY}`, CARET: null, CARET_WIDTH: 0 },
        },
        MODE: VI_MODE.INSERT,
      }
    }
    case 'i': {
      console.log({ MODE: 'INSERT' })
      return {
        ...STATE,
        BUFFER: {
          ...BUFFER,
          LINE: {
            ...LINE,
            CARET: null,
            POSTCARET: `${CARET ?? EMPTY}${POSTCARET}`,
            CARET_WIDTH: 0,
          },
        },
        MODE: VI_MODE.INSERT,
      }
    }
    default:
      return pager({ e: { key }, STATE })
  }
}

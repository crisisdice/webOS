import type { KeyMapping, ViState } from '../../types'
import { VI_MODE } from './constants'
import { EMPTY } from '../../utils'
import { pager } from './pager'

export const processVisualMode: KeyMapping = ({ e: { key }, STATE }) => {
  const {
    BUFFER,
    COORDS,
    COORDS: { y },
    BUFFER: { LINE },
  } = STATE as ViState

  let { x } = COORDS
  const { PRECARET, CARET, POSTCARET } = LINE

  switch (key) {
    case ':': {
      console.log({ MODE: 'COMMAND' })
      return { ...STATE, MODE: VI_MODE.COMMAND }
    }
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

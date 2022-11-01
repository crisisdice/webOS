import type { KeyMapping, ViState } from '../../types'
import { getLengths, shiftUp, shiftDown, shiftLeft, shiftRight } from '../shift'

export const pager: KeyMapping = ({ e: { key }, STATE }) => {
  const {
    BUFFER,
    COORDS: { x, y },
    BUFFER: { LINE },
  } = STATE as ViState
  const { LINE_LENGTH, BUFFER_LENGTH } = getLengths(STATE as ViState)

  switch (key) {
    case 'k':
    case 'ArrowUp': {
      return {
        ...STATE,
        ...shiftUp({ BUFFER, COORDS: { x, y: y !== 0 ? y - 1 : y }, DELETE: false }),
      }
    }
    case 'j':
    case 'ArrowDown': {
      return {
        ...STATE,
        ...shiftDown({ BUFFER, COORDS: { x, y: y !== BUFFER_LENGTH ? y + 1 : y } }),
      }
    }
    case 'h':
    case 'ArrowLeft': {
      return {
        ...STATE,
        BUFFER: { ...BUFFER, LINE: shiftLeft({ LINE }) },
        COORDS: { x: x !== 0 ? x - 1 : x, y },
      }
    }
    case 'l':
    case 'ArrowRight': {
      return {
        ...STATE,
        BUFFER: { ...BUFFER, LINE: shiftRight({ LINE }) },
        COORDS: { x: x !== LINE_LENGTH ? x + 1 : x, y },
      }
    }
    default:
      return STATE
  }
}

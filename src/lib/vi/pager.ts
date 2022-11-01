import type { KeyMapping, ViState } from '../../types'
import { getLengths, shiftUp, shiftDown, shiftLeft, shiftRight } from '../shift'

export const pager: KeyMapping = ({ e: { key }, STATE }) => {
  const {
    BUFFER,
    COORDS,
    BUFFER: { LINE },
  } = STATE as ViState
  const { LINE_LENGTH, BUFFER_LENGTH } = getLengths(STATE as ViState)
  let { x, y } = COORDS

  switch (key) {
    case 'k':
    case 'ArrowUp': {
      if (y !== 0) {
        y -= 1
      }
      return { ...STATE, ...shiftUp({ BUFFER, COORDS: { x, y }, DELETE: false }) }
    }
    case 'j':
    case 'ArrowDown': {
      if (y !== BUFFER_LENGTH) {
        y += 1
      }
      return { ...STATE, ...shiftDown({ BUFFER, COORDS: { x, y } }) }
    }
    case 'h':
    case 'ArrowLeft': {
      if (x !== 0) {
        x -= 1
      }
      return { ...STATE, BUFFER: { ...BUFFER, LINE: shiftLeft({ LINE }) }, COORDS: { x, y } }
    }
    case 'l':
    case 'ArrowRight': {
      if (x !== LINE_LENGTH) {
        x += 1
      }
      return { ...STATE, BUFFER: { ...BUFFER, LINE: shiftRight({ LINE }) }, COORDS: { x, y } }
    }
    default:
      return STATE
  }
}

import type { KeyMapping, VimAppState } from '../../types'
import { VI_MODE } from '../../lib'
import { getLengths, shiftUp, shiftDown, shiftLeft, shiftRight } from '../shift'

export const processVisualMode: KeyMapping = ({ e: { key }, STATE }) => {
  const {
    BUFFER,
    COORDS,
    BUFFER: { LINE },
  } = STATE as VimAppState
  const { LINE_LENGTH, BUFFER_LENGTH } = getLengths(STATE as VimAppState)
  let { x, y } = COORDS

  switch (key) {
    case ':': {
      console.log({ MODE: 'COMMAND' })
      return { ...STATE, MODE: VI_MODE.COMMAND }
    }
    case 'i': {
      console.log({ MODE: 'INSERT' })
      return { ...STATE, MODE: VI_MODE.INSERT }
    }
    case 'k':
    case 'ArrowUp': {
      if (y !== 0) {
        y -= 1
      }
      return { ...STATE, ...shiftUp({ BUFFER, COORDS: { x, y } }) }
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


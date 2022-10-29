import type { KeyMapping, VimAppState } from '../lib/types'
import { VI_MODE } from '../lib/vi/state'
import { DASH } from '../lib/constants'
import { shiftLeft, shiftRight } from './shift'
import { EMPTY_LINE, INITAL_STATE } from '../state'

const shiftUp = ({ BUFFER_PRE, BUFFER_POST, LINE }: VimAppState['BUFFER']) => {
  // TODO
  return { BUFFER_PRE, BUFFER_POST, LINE }
}

const shiftDown = ({ BUFFER_PRE, BUFFER_POST, LINE }: VimAppState['BUFFER']) => {
  // TODO
  return { BUFFER_PRE, BUFFER_POST, LINE }
}

const del = (str: string) => str.slice(0, str.length - 1)

const getLengths = ({ BUFFER }: VimAppState) => {
  const { BUFFER_PRE, LINE, BUFFER_POST } = BUFFER
  const { PRECARET, CARET, POSTCARET } = LINE

  const LINE_LENGTH = PRECARET.length + POSTCARET.length + (CARET === DASH ? 0 : 1)
  const BUFFER_LENGTH = BUFFER_PRE.length + BUFFER_POST.length + 1

  return { LINE_LENGTH, BUFFER_LENGTH }
}

export const viUp: KeyMapping = ({ e: { key }, STATE }) => {
  console.log({ key, ...STATE })

  const { MODE } = STATE as VimAppState
  let { COMMAND_LINE } = STATE as VimAppState

  if (MODE === VI_MODE.COMMAND) {
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
      case 'ArrowLeft': {
        COMMAND_LINE = shiftLeft({ LINE: COMMAND_LINE })
        return { ...STATE, COMMAND_LINE }
      }
      case 'ArrowRight': {
        COMMAND_LINE = shiftRight({ LINE: COMMAND_LINE })
        return { ...STATE, COMMAND_LINE }
      }
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
      MODE,
      COMMAND_LINE: {
        ...COMMAND_LINE,
        PRECARET,
      },
    }
  }

  let {
    BUFFER,
    COORDS: { x, y },
  } = STATE as VimAppState
  let { LINE } = BUFFER
  let { PRECARET } = LINE

  const { LINE_LENGTH, BUFFER_LENGTH } = getLengths(STATE as VimAppState)

  if (MODE === VI_MODE.VISUAL) {
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
        BUFFER = shiftUp(BUFFER)
        return { ...STATE, BUFFER, COORDS: { x, y } }
      }
      case 'j':
      case 'ArrowDown': {
        if (y !== BUFFER_LENGTH) {
          y += 1
        }
        BUFFER = shiftDown(BUFFER)
        return { ...STATE, BUFFER, COORDS: { x, y } }
      }
      case 'h':
      case 'ArrowLeft': {
        if (x !== 0) {
          x -= 1
        }
        LINE = shiftLeft({ LINE })
        return { ...STATE, BUFFER: { ...BUFFER, LINE }, COORDS: { x, y } }
      }
      case 'l':
      case 'ArrowRight': {
        if (x !== LINE_LENGTH) {
          x += 1
        }
        return { ...STATE, BUFFER: { ...BUFFER, LINE }, COORDS: { x, y } }
      }
      default:
        return STATE
    }
  }

  switch (key) {
    case '`': {
      console.log({ MODE: 'VISUAL' })
      return { ...STATE, MODE: VI_MODE.VISUAL }
    }
    case 'ArrowUp': {
      if (y !== 0) {
        y -= 1
      }
      BUFFER = shiftUp(BUFFER)
      return { ...STATE, BUFFER, COORDS: { x, y } }
    }
    case 'ArrowDown': {
      if (y !== BUFFER_LENGTH) {
        y += 1
      }
      BUFFER = shiftDown(BUFFER)
      return { ...STATE, BUFFER, COORDS: { x, y } }
    }
    case 'ArrowLeft': {
      if (x !== 0) {
        x -= 1
      }
      LINE = shiftLeft({ LINE })
      return { ...STATE, BUFFER: { ...BUFFER, LINE }, COORDS: { x, y } }
    }
    case 'ArrowRight': {
      if (x !== LINE_LENGTH) {
        x += 1
      }
      return { ...STATE, BUFFER: { ...BUFFER, LINE }, COORDS: { x, y } }
    }
    case 'Shift':
    case 'Tab':
      break
    case 'Backspace': {
      x = x !== 0 ? x - 1 : x
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

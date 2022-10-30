import type { KeyMapping, Line, VimAppState } from '../lib/types'
import { VI_MODE } from '../lib/vi/state'
import { DASH, ARROW_KEYS, EMPTY } from '../lib/constants'
import { shiftLeft, shiftRight } from './shift'
import { EMPTY_LINE, INITAL_STATE } from '../state'

const lineToString = ({ PRECARET, CARET, POSTCARET }: Line) => {
  return `${PRECARET}${CARET === DASH ? '' : CARET}${POSTCARET}`
}

// TODO unit tests
// TODO fix up/down shift bugs
// TODO fix space as first char bugs
// TODO write command

const shiftUp = ({
  BUFFER,
  BUFFER: { BUFFER_PRE, BUFFER_POST, LINE },
}: {
  BUFFER: VimAppState['BUFFER']
}) => {
  if (BUFFER_PRE.length === 0) return BUFFER

  BUFFER_POST = [lineToString(LINE), ...BUFFER_POST]

  const PRECARET = BUFFER_PRE.at(-1)
  const CARET = PRECARET === EMPTY ? DASH : PRECARET[0]
  LINE = {
    PRECARET,
    CARET,
    POSTCARET: EMPTY,
    CARET_ACTIVE: CARET !== DASH,
  }

  BUFFER_PRE = BUFFER_PRE.slice(0, BUFFER_PRE.length - 1)

  return { BUFFER_PRE, BUFFER_POST, LINE }
}

const shiftDown = ({
  BUFFER,
  BUFFER: { BUFFER_PRE, BUFFER_POST, LINE },
}: {
  BUFFER: VimAppState['BUFFER']
}) => {
  if (BUFFER_POST.length === 0) return BUFFER

  BUFFER_PRE = [...BUFFER_PRE, lineToString(LINE)]

  const PRECARET = BUFFER_POST[0]
  const CARET = PRECARET === EMPTY ? DASH : PRECARET[0]
  LINE = {
    PRECARET,
    CARET,
    POSTCARET: EMPTY,
    CARET_ACTIVE: CARET !== DASH,
  }

  BUFFER_POST = BUFFER_POST.slice(1)

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

const processCommandMode: KeyMapping = ({ e: { key }, STATE }) => {
  let { COMMAND_LINE } = STATE as VimAppState
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
    COMMAND_LINE: {
      ...COMMAND_LINE,
      PRECARET,
    },
  }
}

const processVisualMode: KeyMapping = ({ e: { key }, STATE }) => {
  let {
    BUFFER,
    COORDS: { x, y },
  } = STATE as VimAppState
  let { LINE } = BUFFER

  const { LINE_LENGTH, BUFFER_LENGTH } = getLengths(STATE as VimAppState)

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
      x = 0
      BUFFER = shiftUp({ BUFFER })
      return { ...STATE, BUFFER, COORDS: { x, y } }
    }
    case 'j':
    case 'ArrowDown': {
      if (y !== BUFFER_LENGTH) {
        y += 1
      }
      x = 0
      BUFFER = shiftDown({ BUFFER })
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
      LINE = shiftRight({ LINE })
      return { ...STATE, BUFFER: { ...BUFFER, LINE }, COORDS: { x, y } }
    }
    default:
      return STATE
  }
}

export const viUp: KeyMapping = ({ e: { key }, STATE }) => {
  console.log({ key, ...STATE })

  const { MODE } = STATE as VimAppState

  if (MODE === VI_MODE.COMMAND) return processCommandMode({ e: { key }, STATE })
  if (MODE === VI_MODE.VISUAL || ARROW_KEYS.includes(key))
    return processVisualMode({ e: { key }, STATE })

  const {
    BUFFER: { LINE, BUFFER_POST },
  } = STATE as VimAppState
  let {
    BUFFER,
    BUFFER: {
      LINE: { PRECARET },
    },
    COORDS: { x, y },
  } = STATE as VimAppState

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
      BUFFER = shiftDown({ BUFFER: { ...BUFFER, BUFFER_POST: [EMPTY, ...BUFFER_POST] } })
      return { ...STATE, BUFFER }
    case 'Backspace': {
      if (x !== 0) {
        x -= 1
      }
      // TODO delete line
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

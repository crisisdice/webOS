import { standardUp } from './index'
import type { Line, State } from '../lib/types'
import { VI_MODE } from '../lib/vi/state'
import { EMPTY, DASH } from '../lib/constants'

export const shiftLeft = ({ PRECARET, CARET, POSTCARET, CARET_ACTIVE }: Line) => {
  POSTCARET = CARET === DASH ? EMPTY : `${CARET}${POSTCARET}`
  CARET = PRECARET.at(-1)
  PRECARET = PRECARET.slice(0, PRECARET.length - 1)
  CARET_ACTIVE = true

  return { PRECARET, CARET, POSTCARET, CARET_ACTIVE }
}

export const shiftRight = ({ PRECARET, CARET, POSTCARET, CARET_ACTIVE }: Line) => {
  PRECARET = `${PRECARET}${CARET}`
  CARET = POSTCARET === EMPTY ? DASH : POSTCARET[0]
  POSTCARET = POSTCARET.slice(1, POSTCARET.length)
  CARET_ACTIVE = !(POSTCARET === EMPTY && CARET === DASH)

  return { PRECARET, CARET, POSTCARET, CARET_ACTIVE }
}

export const viUp = ({
  e: { key },
  STATE,
  STATE: {
    FULL_SCREEN,
    APP_NAME,
    UP_MAPPING,
    APP_STATE,
    APP_STATE: { MODE },
  },
}: {
  e: KeyboardEvent
  STATE: State
}): State => {
  console.log({ key, mapping: 'vi', ...APP_STATE })

  if (MODE === VI_MODE.COMMAND) {
    let { PRECARET, CARET, POSTCARET, CARET_ACTIVE } = APP_STATE.COMMAND_LINE

    switch (key) {
      case '`': {
        PRECARET = POSTCARET = EMPTY
        CARET = DASH
        MODE = VI_MODE.VISUAL
        console.log({ MODE: 'VISUAL' })
        break
      }
      case 'q': {
        FULL_SCREEN = false
        APP_NAME = null
        UP_MAPPING = standardUp
        APP_STATE = null
        return { ...STATE, FULL_SCREEN, APP_NAME, UP_MAPPING, APP_STATE }
      }
      case 'ArrowLeft': {
        if (PRECARET === EMPTY) break
        ;({ PRECARET, CARET, POSTCARET, CARET_ACTIVE } = shiftLeft(APP_STATE.COMMAND_LINE))
        break
      }
      case 'ArrowRight': {
        if (CARET === DASH) break
        ;({ PRECARET, CARET, POSTCARET, CARET_ACTIVE } = shiftRight(APP_STATE.COMMAND_LINE))
        break
      }
      case 'Backspace': {
        PRECARET = PRECARET.slice(0, PRECARET.length - 1)
        break
      }
      case 'Shift':
      case 'Tab':
        break
      default: {
        PRECARET += key
      }
    }

    return {
      ...STATE,
      APP_STATE: { ...APP_STATE, MODE, COMMAND_LINE: { PRECARET, CARET, POSTCARET, CARET_ACTIVE } },
    }
  }

  let {
    BUFFER_PRE,
    BUFFER_POST,
    LINE,
    LINE: { PRECARET, CARET, POSTCARET, CARET_ACTIVE },
    COORDS: { x, y },
  } = APP_STATE

  const linelength = PRECARET.length + POSTCARET.length + (CARET === DASH ? 0 : 1)

  if (MODE === VI_MODE.VISUAL) {
    switch (key) {
      case ':': {
        PRECARET = POSTCARET = EMPTY
        CARET = DASH
        MODE = VI_MODE.COMMAND
        console.log({ MODE: 'VISUAL' })
        break
      }
      case 'i': {
        MODE = VI_MODE.INSERT
        console.log({ MODE: 'INSERT' })
        break
      }
      case 'h': {
        if (PRECARET === EMPTY) break
        LINE = shiftLeft(LINE)
        // TODO this check should not be needed because it should break above
        x = x !== 0 ? x - 1 : x
        break
      }
      case 'l': {
        if (CARET === DASH) break
        LINE = shiftRight(LINE)
        x = x !== linelength ? x + 1 : x
        break
      }
    }

    return { ...STATE, APP_STATE: { ...APP_STATE, MODE, LINE, COORDS: { x, y } } }
  }

  switch (key) {
    case '`': {
      MODE = VI_MODE.VISUAL
      console.log({ MODE: 'VISUAL' })
      break
    }
    case 'Backspace': {
      x = x !== 0 ? x - 1 : x
      PRECARET = PRECARET.slice(0, PRECARET.length - 1)
      break
    }
    case 'ArrowLeft': {
      if (PRECARET === EMPTY) break
      LINE = shiftLeft(LINE)
      x = x !== 0 ? x - 1 : x
      break
    }
    case 'ArrowRight': {
      if (CARET === DASH) break
      LINE = shiftRight(LINE)
      x = x !== linelength ? x + 1 : x
      break
    }
    case 'Shift':
    case 'Tab':
      break
    default: {
      x += 1
      PRECARET += key
    }
  }

  return {
    ...STATE,
    APP_STATE: {
      ...APP_STATE,
      LINE: {
        PRECARET,
        CARET,
        POSTCARET,
        CARET_ACTIVE,
      },
      MODE,
      BUFFER_PRE,
      BUFFER_POST,
      BUFFER: [
        ...BUFFER_PRE,
        `${PRECARET}${CARET !== DASH ? CARET : ''}${POSTCARET}`,
        ...BUFFER_POST,
      ],
      COORDS: { x, y },
    },
  }
}

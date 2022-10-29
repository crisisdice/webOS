import type { State, VimAppState } from '../lib/types'
import { VI_MODE } from '../lib/vi/state'
import { EMPTY, DASH } from '../lib/constants'
import { shiftLeft, shiftRight } from './shift'
import { EMPTY_LINE, INITAL_APP_STATE } from '../state'

export const viUp = ({
  e: { key },
  STATE,
  STATE: { APP_STATE },
}: {
  e: KeyboardEvent
  STATE: State
}): State => {
  console.log({ key, mapping: 'vi', ...APP_STATE })

  let { MODE, COMMAND_LINE } = APP_STATE as VimAppState

  if (MODE === VI_MODE.COMMAND) {
    const { PRECARET, CARET } = COMMAND_LINE

    switch (key) {
      case '`': {
        COMMAND_LINE = { ...EMPTY_LINE }
        MODE = VI_MODE.VISUAL
        console.log({ MODE: 'VISUAL' })
        break
      }
      case 'q': {
        return { ...STATE, APP_STATE: INITAL_APP_STATE }
      }
      case 'ArrowLeft': {
        if (PRECARET === EMPTY) break
        COMMAND_LINE = shiftLeft(COMMAND_LINE)
        break
      }
      case 'ArrowRight': {
        if (CARET === DASH) break
        COMMAND_LINE = shiftRight(COMMAND_LINE)
        break
      }
      case 'Backspace': {
        COMMAND_LINE.PRECARET = COMMAND_LINE.PRECARET.slice(0, COMMAND_LINE.PRECARET.length - 1)
        break
      }
      case 'Shift':
      case 'Tab':
        break
      default: {
        COMMAND_LINE.PRECARET += key
      }
    }

    return {
      ...STATE,
      APP_STATE: { ...APP_STATE, MODE, COMMAND_LINE },
    }
  }

  let {
    BUFFER_PRE,
    BUFFER_POST,
    LINE,
    COORDS: { x, y },
  } = APP_STATE as VimAppState

  const { PRECARET, CARET, POSTCARET } = LINE
  const linelength = PRECARET.length + POSTCARET.length + (CARET === DASH ? 0 : 1)

  if (MODE === VI_MODE.VISUAL) {
    switch (key) {
      case ':': {
        MODE = VI_MODE.COMMAND
        console.log({ MODE: 'VISUAL' })
        break
      }
      case 'i': {
        MODE = VI_MODE.INSERT
        console.log({ MODE: 'INSERT' })
        break
      }
      case 'ArrowLeft':
      case 'h': {
        if (PRECARET === EMPTY) break
        LINE = shiftLeft(LINE)
        // TODO this check should not be needed because it should break above
        x = x !== 0 ? x - 1 : x
        break
      }
      case 'ArrowRight':
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
      LINE.PRECARET = LINE.PRECARET.slice(0, LINE.PRECARET.length - 1)
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
      LINE.PRECARET += key
    }
  }

  return {
    ...STATE,
    APP_STATE: {
      ...APP_STATE,
      LINE,
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

import type { Line, VimAppState } from '../types'
import { lineToString, stringToLine, DASH, EMPTY } from '../utils'

export const shiftLeft = ({
  LINE,
  LINE: { PRECARET, CARET, POSTCARET, CARET_ACTIVE },
}: {
  LINE: Line
}) => {
  if (PRECARET === EMPTY) return LINE

  POSTCARET = CARET === DASH ? EMPTY : `${CARET}${POSTCARET}`
  CARET = PRECARET.at(-1)
  PRECARET = PRECARET.slice(0, PRECARET.length - 1)
  CARET_ACTIVE = true

  return { PRECARET, CARET, POSTCARET, CARET_ACTIVE }
}

export const shiftRight = ({
  LINE,
  LINE: { PRECARET, CARET, POSTCARET, CARET_ACTIVE },
}: {
  LINE: Line
}) => {
  if (CARET === DASH) return LINE

  PRECARET = `${PRECARET}${CARET}`
  CARET = POSTCARET === EMPTY ? DASH : POSTCARET[0]
  POSTCARET = POSTCARET.slice(1, POSTCARET.length)
  CARET_ACTIVE = !(POSTCARET === EMPTY && CARET === DASH)

  return { PRECARET, CARET, POSTCARET, CARET_ACTIVE }
}

export const shiftUp = ({
  BUFFER,
  BUFFER: { BUFFER_PRE, BUFFER_POST, LINE },
  COORDS: { x, y },
}: {
  BUFFER: VimAppState['BUFFER'] & { LINE: null | Line }
  COORDS: VimAppState['COORDS']
}) => {
  if (BUFFER_PRE.length === 0) return BUFFER

  BUFFER_POST = LINE === null ? BUFFER_POST : [lineToString(LINE), ...BUFFER_POST]

  const newLine = BUFFER_PRE.at(-1)
  x = x > newLine.length ? newLine.length : x
  LINE = stringToLine(newLine, x)
  BUFFER_PRE = BUFFER_PRE.slice(0, BUFFER_PRE.length - 1)

  return { BUFFER: { BUFFER_PRE, BUFFER_POST, LINE }, COORDS: { x, y } }
}

export const shiftDown = ({
  BUFFER,
  BUFFER: { BUFFER_PRE, BUFFER_POST, LINE },
  COORDS: { x, y },
}: {
  BUFFER: VimAppState['BUFFER']
  COORDS: VimAppState['COORDS']
}) => {
  if (BUFFER_POST.length === 0) return BUFFER

  BUFFER_PRE = [...BUFFER_PRE, lineToString(LINE)]
  const newLine = BUFFER_POST[0]
  x = x > newLine.length ? newLine.length : x
  LINE = stringToLine(newLine, x)
  BUFFER_POST = BUFFER_POST.slice(1)

  return { BUFFER: { BUFFER_PRE, BUFFER_POST, LINE }, COORDS: { x, y } }
}

export const getLengths = ({ BUFFER }: VimAppState) => {
  const { BUFFER_PRE, LINE, BUFFER_POST } = BUFFER
  const { PRECARET, CARET, POSTCARET } = LINE

  const LINE_LENGTH = PRECARET.length + POSTCARET.length + (CARET === DASH ? 0 : 1)
  const BUFFER_LENGTH = BUFFER_PRE.length + BUFFER_POST.length + 1

  return { LINE_LENGTH, BUFFER_LENGTH }
}

export const del = (str: string) => str.slice(0, str.length - 1)

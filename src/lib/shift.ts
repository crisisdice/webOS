import type { Line, ViState } from '../types'
import { lineToString, stringToLine, EMPTY } from '../utils'

export const shiftLeft = ({
  LINE,
  LINE: { PRECARET, CARET, POSTCARET, EOL, CARET_WIDTH },
}: {
  LINE: Line
}) => {
  if (PRECARET === EMPTY) return LINE

  const char = PRECARET.at(-1)

  POSTCARET = `${CARET_WIDTH === 1 ? CARET ?? EMPTY : char}${POSTCARET}`
  CARET = CARET_WIDTH === 1 ? char : null
  PRECARET = PRECARET.slice(0, PRECARET.length - 1)
  EOL = false

  return { PRECARET, CARET, POSTCARET, EOL, CARET_WIDTH }
}

export const shiftRight = ({
  LINE,
  LINE: { PRECARET, CARET, POSTCARET, EOL, CARET_WIDTH },
}: {
  LINE: Line
}) => {
  if (EOL) return LINE

  const char = POSTCARET[0]

  PRECARET = `${PRECARET}${CARET_WIDTH === 1 ? CARET : char}`
  CARET = POSTCARET === EMPTY || CARET_WIDTH === 0 ? null : char
  POSTCARET = POSTCARET.slice(1, POSTCARET.length)
  EOL = POSTCARET === EMPTY && (CARET_WIDTH === 0 || CARET === null)

  return { PRECARET, CARET, POSTCARET, EOL, CARET_WIDTH }
}

export const shiftUp = ({
  BUFFER,
  BUFFER: {
    BUFFER_PRE,
    BUFFER_POST,
    LINE,
    LINE: { CARET_WIDTH },
  },
  COORDS: { x, y },
  DELETE = false,
}: {
  BUFFER: ViState['BUFFER']
  COORDS: ViState['COORDS']
  DELETE: boolean
}) => {
  if (BUFFER_PRE.length === 0) return BUFFER

  BUFFER_POST = DELETE ? BUFFER_POST : [lineToString(LINE), ...BUFFER_POST]
  const newLine = BUFFER_PRE.at(-1)
  x = x > newLine.length ? newLine.length : x
  LINE = stringToLine(newLine, x, CARET_WIDTH)
  BUFFER_PRE = BUFFER_PRE.slice(0, BUFFER_PRE.length - 1)

  return { BUFFER: { BUFFER_PRE, BUFFER_POST, LINE }, COORDS: { x, y } }
}

export const shiftDown = ({
  BUFFER,
  BUFFER: {
    BUFFER_PRE,
    BUFFER_POST,
    LINE,
    LINE: { CARET_WIDTH },
  },
  COORDS: { x, y },
}: {
  BUFFER: ViState['BUFFER']
  COORDS: ViState['COORDS']
}) => {
  if (BUFFER_POST.length === 0) return BUFFER

  BUFFER_PRE = [...BUFFER_PRE, lineToString(LINE)]
  const newLine = BUFFER_POST[0]
  x = x > newLine.length ? newLine.length : x
  LINE = stringToLine(newLine, x, CARET_WIDTH)
  BUFFER_POST = BUFFER_POST.slice(1)

  return { BUFFER: { BUFFER_PRE, BUFFER_POST, LINE }, COORDS: { x, y } }
}

const getLineLength = ({ LINE: { PRECARET, CARET, POSTCARET } }: { LINE: Line }) => {
  return PRECARET.length + POSTCARET.length + (CARET === null ? 0 : 1)
}

export const getLengths = ({ BUFFER }: ViState) => {
  const { BUFFER_PRE, LINE, BUFFER_POST } = BUFFER
  const BUFFER_LENGTH = BUFFER_PRE.length + BUFFER_POST.length + 1
  const LINE_LENGTH = getLineLength({ LINE })

  return { LINE_LENGTH, BUFFER_LENGTH }
}

export const del = (str: string) => str.slice(0, str.length - 1)

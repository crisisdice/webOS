import type { Line } from '../types'
import { EMPTY, DASH } from '../utils'

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

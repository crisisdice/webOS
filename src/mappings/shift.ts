import type { Line } from '../lib/types'
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

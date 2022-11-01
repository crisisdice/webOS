import type { Line, ViState } from '../types'
import { EMPTY, PWD, EMPTY_BUFFER } from './constants'
import { getEnv, stat } from '../lib'

export const lineToString = ({ PRECARET, CARET, POSTCARET }: Line) => {
  return `${PRECARET}${CARET === null ? '' : CARET}${POSTCARET}`
}

export const stringToLine = (line: string, x: number, CARET_WIDTH = 1): Line => {
  const PRECARET = line.slice(0, x)
  const EOL = x === line.length
  const CARET = EOL || CARET_WIDTH === 0 ? null : line[x]
  const POSTCARET = EOL ? EMPTY : line.slice(x + CARET_WIDTH)

  return {
    PRECARET,
    CARET,
    POSTCARET,
    EOL,
    CARET_WIDTH,
  }
}

export function fileToBuffer(fileName: string | null): {
  BUFFER: ViState['BUFFER']
  FILE_NAME: string | null
} {
  const { exists, obj, path, isDirectory } = stat('', fileName)

  if (!exists || isDirectory) {
    return { BUFFER: EMPTY_BUFFER, FILE_NAME: fileName ? `${getEnv(PWD)}/${fileName}` : null }
  }
  if (obj === EMPTY) {
    return { BUFFER: EMPTY_BUFFER, FILE_NAME: path }
  }

  const file = (obj as string).split('\n')

  const BUFFER_PRE = []
  const LINE = stringToLine(file[0], 0)
  const BUFFER_POST = file.slice(1)

  return { BUFFER: { BUFFER_PRE, BUFFER_POST, LINE }, FILE_NAME: path }
}

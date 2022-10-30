import type { ShellState, Line, VimAppState } from '../types'
import { standardUp, standardDown } from '../mappings'
import { DASH, EMPTY, PWD, HOME } from './constants'
import { getEnv, setEnv, setFs, stat } from '../lib'

export const EMPTY_LINE = Object.freeze({
  PRECARET: EMPTY,
  CARET: DASH,
  POSTCARET: EMPTY,
  CARET_ACTIVE: false,
})

export const EMPTY_BUFFER = Object.freeze({
  LINE: { ...EMPTY_LINE },
  BUFFER_PRE: [],
  BUFFER_POST: [],
})

export const INITAL_STATE: Readonly<ShellState> = Object.freeze({
  OLD_COMMANDS: [],
  COMMAND_LINE: { ...EMPTY_LINE },
  USER: 'guest',
  PWD: '/home/guest',
  CONTROL_DOWN: false,
  FULL_SCREEN: false,
  NAME: 'sh',
  UP_MAPPING: standardUp,
  DOWN_MAPPING: standardDown,
})

// TODO let init handle user and pwd
// TODO whoami and login
export const init = () => {
  setEnv(PWD, '/home/guest')
  setEnv(HOME, '/home/guest')

  setFs({
    home: {
      guest: {
        '.bashrc': '#!/usr/sh',
        '.history': '',
      },
      root: {},
    },
  })
}

export const lineToString = ({ PRECARET, CARET, POSTCARET }: Line) => {
  return `${PRECARET}${CARET === DASH ? '' : CARET}${POSTCARET}`
}

export const stringToLine = (line: string, x: number): Line => {
  const PRECARET = line.slice(0, x)
  const CARET = x === line.length ? DASH : line[x]
  const CARET_ACTIVE = CARET !== DASH
  const POSTCARET = CARET_ACTIVE ? line.slice(x + 1) : EMPTY

  return {
    PRECARET,
    CARET,
    POSTCARET,
    CARET_ACTIVE,
  }
}

export function parseCmd(cmd: Line): string[] {
  // TODO escapes and quoting
  return lineToString(cmd).split(' ')
}

export function fileToBuffer(fileName: string | null): {
  BUFFER: VimAppState['BUFFER']
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

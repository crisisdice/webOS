import type { ShellState, Line, ViState } from '../types'
import { standardUp, standardDown } from '../mappings'
import { EMPTY, PWD, HOME } from './constants'
import { getEnv, setEnv, setFs, stat } from '../lib'
import { APPS } from './apps'

export const EMPTY_LINE = Object.freeze({
  PRECARET: EMPTY,
  CARET: null,
  POSTCARET: EMPTY,
  EOL: true,
  CARET_WIDTH: 1,
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
  NAME: APPS.SH,
  UP_MAPPING: standardUp,
  DOWN_MAPPING: standardDown,
  HISTORY_INDEX: -1,
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
  return `${PRECARET}${CARET === null ? '' : CARET}${POSTCARET}`
}

export const stringToLine = (line: string, x: number, CARET_WIDTH = 1): Line => {
  const PRECARET = line.slice(0, x)
  const EOL = x === line.length
  const CARET = EOL || CARET_WIDTH === 0 ? null : line[x]
  const POSTCARET = EOL ? EMPTY : line.slice(x + 1)

  return {
    PRECARET,
    CARET,
    POSTCARET,
    EOL,
    CARET_WIDTH,
  }
}

export function parseCmd(input: Line) {
  // TODO command parsing, .i.e. flags, different args, shell expansions, pipes, quotes
  // TODO escapes and quoting
  const commandTokens = lineToString(input).split(' ')
  const cmd = commandTokens?.[0] ?? ''
  const args = commandTokens.slice(1)

  return { cmd, args }
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

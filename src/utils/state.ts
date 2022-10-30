import type { ShellState, Line } from '../types'
import { standardUp, standardDown } from '../mappings'
import { DASH, EMPTY, PWD, HOME } from './constants'
import { setEnv, setFs } from '../lib'

export const EMPTY_LINE = Object.freeze({
  PRECARET: EMPTY,
  CARET: DASH,
  POSTCARET: EMPTY,
  CARET_ACTIVE: false,
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

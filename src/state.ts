import { standardUp, standardDown } from './mappings'
import { DASH, EMPTY } from './lib/constants'
import type { ShellState } from './lib/types'

export const EMPTY_LINE = Object.freeze({
  PRECARET: EMPTY,
  CARET: DASH,
  POSTCARET: EMPTY,
  CARET_ACTIVE: false,
})

export const INITAL_STATE: Readonly<ShellState> = Object.freeze({
  OLD_COMMANDS: [],
  COMMAND_LINE: { ...EMPTY_LINE },
  USER : 'guest',
  PWD : '/home/guest',
  CONTROL_DOWN: false,
  FULL_SCREEN: false,
  NAME: 'sh',
  UP_MAPPING : standardUp,
  DOWN_MAPPING : standardDown,
})

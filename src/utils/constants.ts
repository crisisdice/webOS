import type { ShellState } from '../types'
import { standardUp, standardDown } from '../mappings'

export const EMPTY = ''

export const ENV = 'ENV'

export const FS = 'FS'

export const PWD = 'PWD'

export const HOME = 'HOME'

export const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

export enum APPS {
  SH,
  VI,
}

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

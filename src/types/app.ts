import { APPS } from '../utils'
import { VI_MODE } from '../lib'

/* system */
export type ENV = {
  PWD: string
  HOME: string
}

export type Directory = {
  [key: string]: string | Directory
}

export type Stat = {
  exists: boolean
  path: string
  isDirectory: boolean
  obj: Directory | string
}

export type Line = {
  PRECARET: string
  CARET: string | null
  POSTCARET: string
  EOL: boolean
  CARET_WIDTH: number
}

/* input */
export type KeyMapping = ({ e, STATE }: { e: { key: string }; STATE: State }) => State

export type Command = { COMMAND_LINE: Line; USER: string; PWD: string; STDOUT: string }

export type State = ShellState | ViState

/* apps */
export type BaseState = {
  CONTROL_DOWN: boolean
  NAME: APPS
  UP_MAPPING: KeyMapping
  DOWN_MAPPING: KeyMapping
  COMMAND_LINE: Line
  OLD_COMMANDS: Command[]
}

export type ShellState = BaseState & {
  HISTORY_INDEX: number
  USER: string
  PWD: string
}

export type ViState = BaseState & {
  MODE: VI_MODE
  BUFFER: {
    BUFFER_PRE: string[]
    LINE: Line
    BUFFER_POST: string[]
  }
  COORDS: { x: number; y: number }
  FILE_NAME: string | null
  REGISTERS: Record<string, { contents: string; isLine: boolean }>
  MESSAGE: string | null
}

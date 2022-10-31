import { APPS } from '../utils'
import { VI_MODE } from '../lib'

// TODO organize types

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

// TODO standardize command type
export type Command = { cmd: string; wd: string; stdout: string; usr: string }

export type KeyMapping = ({ e, STATE }: { e: { key: string }; STATE: State }) => State

export type VimAppState = AppState & {
  MODE: VI_MODE
  BUFFER: {
    BUFFER_PRE: string[]
    LINE: Line
    BUFFER_POST: string[]
  }
  COORDS: { x: number; y: number }
  FILE_NAME: string | null
}

export type AppState = {
  CONTROL_DOWN: boolean
  NAME: APPS
  UP_MAPPING: KeyMapping
  DOWN_MAPPING: KeyMapping
  COMMAND_LINE: Line
  OLD_COMMANDS: Command[]
}

export type ShellState = AppState & {
  HISTORY_INDEX: number
  USER: string
  PWD: string
}

export type State = VimAppState | AppState | ShellState

export type Line = {
  PRECARET: string
  CARET: string | null
  POSTCARET: string
  EOL: boolean
  CARET_WIDTH: number
}

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

export type Commands = { cmd: string; wd: string; stdout: string; usr: string }[]

export type KeyMapping = ({ e, STATE }: { e: { key: string }; STATE: State }) => State

export type VimAppState = AppState & {
  MODE: VI_MODE
  BUFFER: {
    BUFFER_PRE: string[]
    LINE: Line
    BUFFER_POST: string[]
  }
  COORDS: { x: number; y: number }
}

export type AppState = {
  CONTROL_DOWN: boolean
  FULL_SCREEN: boolean
  NAME: string
  UP_MAPPING: KeyMapping
  DOWN_MAPPING: KeyMapping
  COMMAND_LINE: Line
}

export type ShellState = AppState & {
  OLD_COMMANDS: Commands
  USER: string
  PWD: string
}

export type State = VimAppState | AppState | ShellState

export type Line = {
  PRECARET: string
  CARET: string
  POSTCARET: string
  CARET_ACTIVE: boolean
}

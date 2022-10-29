import { VI_MODE } from './vi/state'

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

export type KeyMapping = ({ e, STATE }: { e: KeyboardEvent; STATE: State }) => State

export type VimAppState = AppState & {
  MODE: VI_MODE
  BUFFER: string[]
  BUFFER_PRE: string[]
  LINE: Line
  BUFFER_POST: string[]
  COMMAND_LINE: Line
  COORDS: { x: number; y: number }
}

export type AppState = {
  CONTROL_DOWN: boolean
  FULL_SCREEN: boolean
  NAME: string
  UP_MAPPING: KeyMapping
  DOWN_MAPPING: KeyMapping
}

// TODO sh as App state?

export type State = {
  OLD_COMMANDS: Commands
  APP_STATE: VimAppState | AppState
  COMMAND_LINE: Line
  USER: string
  PWD: string
}

export type Line = {
  PRECARET: string
  CARET: string
  POSTCARET: string
  CARET_ACTIVE: boolean
}

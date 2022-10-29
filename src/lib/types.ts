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

export type AppState = {
  [key: string]: string
}

export type VimAppState = {
  MODE: VI_MODE
  BUFFER: string[]
  BUFFER_PRE: string[]
  LINE: Line
  BUFFER_POST: string[]
  COMMAND_LINE: Line
  COORDS: { x: number; y: number }
}

export type State = {
  CONTROL_DOWN: boolean
  OLD_COMMANDS: Commands
  FULL_SCREEN: boolean
  APP_NAME: string | null
  APP_STATE: VimAppState | null
  UP_MAPPING: KeyMapping
  DOWN_MAPPING: KeyMapping
  PRECARET: string
  CARET: string
  POSTCARET: string
  CARET_ACTIVE: boolean
  USER: string
  PWD: string
}

export type Line = {
  PRECARET: string
  CARET: string
  POSTCARET: string
  CARET_ACTIVE: boolean
}

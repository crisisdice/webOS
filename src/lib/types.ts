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

export type VimAppState = AppState & {
  // TODO abstract caret logic
  footerPreCaret: string
  footerCaret: string
  footerPostCaret: string
}
export type State = {
  CONTROL_DOWN: boolean
  OLD_COMMANDS: Commands
  FULL_SCREEN: boolean
  APP_NAME: string | null
  APP_STATE: AppState
  UP_MAPPING: KeyMapping
  DOWN_MAPPING: KeyMapping
  PRECARET: string
  CARET: string
  POSTCARET: string
  CARET_ACTIVE: boolean
  USER: string
  PWD: string
}

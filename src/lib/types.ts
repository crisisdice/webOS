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

export type KeyMapping = ({ key }: KeyboardEvent) => void

export type AppState = {
  [key: string]: string
}

export type VimAppState = AppState & {
  // TODO abstract caret logic
  footerPreCaret: string
  footerCaret: string
  footerPostCaret: string
}

export type APPSTATE = {
  controlDown: boolean
  oldCommands: Commands
  fullScreen: boolean
  appName: string | null
  appState: AppState
  upMapping: KeyMapping
  downMapping: KeyMapping
  precaret: string
  caret: string
  postcaret: string
  caretActive: boolean
  pwd: string
}

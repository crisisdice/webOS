import type { ShellState, State, VimAppState } from '../types'
import { fileToBuffer, lineToString, EMPTY_LINE, APPS } from '../utils'
import { viUp } from '../mappings'

export enum VI_MODE {
  VISUAL,
  INSERT,
  COMMAND,
}

export const startVi = ({
  STATE,
  args,
  wd,
}: {
  STATE: State
  args: string[]
  wd: string
}): VimAppState => {
  const { OLD_COMMANDS, COMMAND_LINE, USER } = STATE as ShellState

  return {
    ...STATE,
    ...fileToBuffer(args?.[0]),
    OLD_COMMANDS: [...OLD_COMMANDS, { cmd: lineToString(COMMAND_LINE), stdout: '', wd, usr: USER }],
    NAME: APPS.VI,
    UP_MAPPING: viUp,
    MODE: VI_MODE.VISUAL,
    COMMAND_LINE: { ...EMPTY_LINE },
    COORDS: { x: 0, y: 0 },
  }
}

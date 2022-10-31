import type { ShellState, ViState } from '../types'
import { fileToBuffer, EMPTY_LINE, APPS } from '../utils'
import { viUp } from '../mappings'

export enum VI_MODE {
  VISUAL,
  INSERT,
  COMMAND,
}

export const startVi = ({ STATE, args }: { STATE: ShellState; args: string[] }): ViState => {
  return {
    ...STATE,
    ...fileToBuffer(args?.[0]),
    NAME: APPS.VI,
    UP_MAPPING: viUp,
    MODE: VI_MODE.VISUAL,
    COMMAND_LINE: { ...EMPTY_LINE },
    COORDS: { x: 0, y: 0 },
  }
}

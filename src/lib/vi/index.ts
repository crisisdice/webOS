import type { ViState, ShellState, KeyMapping } from '../../types'
import { VI_MODE } from './constants'
import { fileToBuffer, EMPTY_LINE, APPS, ARROW_KEYS } from '../../utils'
import { processCommandMode } from './command'
import { processVisualMode } from './visual'
import { processInsertMode } from './insert'
import { pager } from './pager'

export const startVi = ({ STATE, args }: { STATE: ShellState; args: string[] }): ViState => {
  return {
    ...STATE,
    ...fileToBuffer(args?.[0]),
    NAME: APPS.VI,
    UP_MAPPING: viUp,
    MODE: VI_MODE.VISUAL,
    COMMAND_LINE: { ...EMPTY_LINE },
    COORDS: { x: 0, y: 0 },
    MESSAGE: null,
    REGISTERS: {},
  }
}

export const viUp: KeyMapping = ({
  e,
  e: { key },
  STATE,
  STATE: { MODE },
}: {
  e: KeyboardEvent
  STATE: ViState
}) => {
  STATE = { ...STATE, MESSAGE: null }
  switch (MODE) {
    case VI_MODE.COMMAND:
      return processCommandMode({ e, STATE })
    case VI_MODE.INSERT:
      return ARROW_KEYS.includes(key)
        ? pager({ e: { key }, STATE })
        : processInsertMode({ e, STATE })
    case VI_MODE.VISUAL:
      return processVisualMode({ e, STATE })
    // TODO highlighting
    case VI_MODE.VISUAL_BLOCK:
    case VI_MODE.VISUAL_LINE:
    default:
      return STATE
  }
}

export { VI_MODE }

import type { ViState, ShellState, KeyMapping } from '../../types'
import { VI_MODE as MODE, VI_MODE } from './constants'
import { fileToBuffer, EMPTY_LINE, APPS, ARROW_KEYS } from '../../utils'
import { processCommandMode } from './command'
import { processVisualMode } from './visual'
import { processInsertMode } from './insert'

export const startVi = ({ STATE, args }: { STATE: ShellState; args: string[] }): ViState => {
  return {
    ...STATE,
    ...fileToBuffer(args?.[0]),
    NAME: APPS.VI,
    UP_MAPPING: viUp,
    MODE: MODE.VISUAL,
    COMMAND_LINE: { ...EMPTY_LINE },
    COORDS: { x: 0, y: 0 },
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
  if (ARROW_KEYS.includes(key)) return processVisualMode({ e: { key }, STATE })

  switch (MODE) {
    case VI_MODE.COMMAND:
      return processCommandMode({ e, STATE })
    case VI_MODE.INSERT:
      return processInsertMode({ e, STATE })
    case VI_MODE.VISUAL:
      return processVisualMode({ e, STATE })
    default:
      return STATE
  }
}

export { MODE as VI_MODE }

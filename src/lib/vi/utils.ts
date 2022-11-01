import type { ViState } from '../../types'
import { write, separate } from '../../lib'
import { EMPTY_LINE, INITAL_STATE, bufferToFile } from '../../utils'
import { VI_MODE } from './constants'

// TODO own vi command parser
import { parseCmd } from '../sh/evaluate'

function writeFile({ args, STATE }: { args: string[]; STATE: ViState }): ViState {
  const { FILE_NAME, BUFFER } = STATE
  write({ ...separate(FILE_NAME ?? args[0] ?? 'temp'), obj: bufferToFile(BUFFER) })
  return { ...STATE, COMMAND_LINE: EMPTY_LINE, MODE: VI_MODE.VISUAL }
}

export function vimCommands(STATE: ViState) {
  const { COMMAND_LINE, OLD_COMMANDS } = STATE
  const { cmd, args } = parseCmd(COMMAND_LINE)

  switch (cmd ?? '') {
    case 'q':
      return { ...INITAL_STATE, OLD_COMMANDS }
    case 'w':
      return writeFile({ args, STATE })
    default:
      return { ...STATE, COMMAND_LINE: EMPTY_LINE, MODE: VI_MODE.VISUAL }
  }
}

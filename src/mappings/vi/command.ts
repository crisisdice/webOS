import type { KeyMapping, ViState } from '../../types'
import { VI_MODE, write, separate, parseCmd } from '../../lib'
import { EMPTY_LINE, INITAL_STATE, lineToString } from '../../utils'
import { del, shiftLeft, shiftRight } from '../shift'

function bufferToFile({ BUFFER_PRE, LINE, BUFFER_POST }: ViState['BUFFER']): string {
  return [ ...BUFFER_PRE, lineToString(LINE), ...BUFFER_POST ].join('\n')
}

function vimCommands(STATE: ViState) {
  const { COMMAND_LINE, OLD_COMMANDS } = STATE
  // TODO own vi command parser
  const { cmd, args }= parseCmd(COMMAND_LINE)
  
  switch (cmd ?? '') {
    case 'q':
      return { ...INITAL_STATE, OLD_COMMANDS }
    case 'w':
      return writeFile({ args, STATE })
    default:
      return { ...STATE, COMMAND_LINE: EMPTY_LINE, MODE: VI_MODE.VISUAL }
  }
}

function writeFile({ args, STATE }: { args: string[], STATE: ViState }): ViState {
  const { FILE_NAME, BUFFER } = STATE
  write({ ...separate(FILE_NAME ?? args[0] ?? 'temp'), obj: bufferToFile(BUFFER) })
  return { ...STATE, COMMAND_LINE: EMPTY_LINE, MODE: VI_MODE.VISUAL }
}

export const processCommandMode: KeyMapping = ({ e: { key }, STATE }) => {
  const { COMMAND_LINE } = STATE as ViState
  let { PRECARET } = COMMAND_LINE

  switch (key) {
    case '`': {
      console.log({ MODE: 'VISUAL' })
      return { ...STATE, COMMAND_LINE: { ...EMPTY_LINE }, MODE: VI_MODE.VISUAL }
    }
    case 'Enter':
      return vimCommands(STATE as ViState)
    case 'ArrowLeft':
      return { ...STATE, COMMAND_LINE: shiftLeft({ LINE: COMMAND_LINE }) }
    case 'ArrowRight':
      return { ...STATE, COMMAND_LINE: shiftRight({ LINE: COMMAND_LINE }) }
    case 'ArrowUp':
    case 'ArrowDown':
    case 'Alt':
    case 'Shift':
    case 'Tab':
      break
    case 'Backspace': {
      PRECARET = del(PRECARET)
      break
    }
    default: {
      PRECARET += key
    }
  }

  return {
    ...STATE,
    COMMAND_LINE: {
      ...COMMAND_LINE,
      PRECARET,
    },
  }
}

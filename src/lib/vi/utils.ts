import type { Line, ViState } from '../../types'
import { write, stat } from '../fs'
import { separate } from '../path'
import { EMPTY_LINE, INITAL_STATE, bufferToFile, lineToString, EMPTY } from '../../utils'
import { VI_MODE } from './constants'

function parseCmd(input: Line) {
  const commandTokens = lineToString(input).split(' ')
  const cmd = commandTokens?.[0] ?? ''
  const args = commandTokens.slice(1)

  const cmds = cmd.split('')
  const override = cmds.includes('!')

  return { cmds, args, override }
}

function writeFile({ args, STATE }: { args: string[]; STATE: ViState }): ViState {
  let { FILE_NAME } = STATE
  const { BUFFER } = STATE
  FILE_NAME = FILE_NAME ?? args?.[0]

  if (!FILE_NAME) return report({ STATE, MESSAGE: 'No file name' })

  write({ ...separate(FILE_NAME), obj: bufferToFile(BUFFER) })
  return { ...STATE, COMMAND_LINE: EMPTY_LINE, MODE: VI_MODE.VISUAL, FILE_NAME }
}

function checkSaveStatus({ STATE }: { STATE: ViState }): boolean {
  const { FILE_NAME, BUFFER } = STATE
  const { exists, obj } = stat(FILE_NAME)
  const file = bufferToFile(BUFFER)

  return !exists ? file === EMPTY : obj === file
}

function report({ STATE, MESSAGE }: { STATE: ViState; MESSAGE: string }) {
  return { ...STATE, MESSAGE, COMMAND_LINE: EMPTY_LINE }
}

export function vimCommands(STATE: ViState) {
  const { COMMAND_LINE, OLD_COMMANDS } = STATE
  const { cmds, args, override } = parseCmd(COMMAND_LINE)

  for (const cmd of cmds) {
    if (cmd === 'w') {
      STATE = writeFile({ args, STATE })
      continue
    }

    if (cmd === 'q') {
      if (!checkSaveStatus({ STATE }) && !override) {
        return report({ STATE, MESSAGE: 'No write since last change' })
      }
      return { ...INITAL_STATE, OLD_COMMANDS }
    }

    return { ...STATE, COMMAND_LINE: EMPTY_LINE, MODE: VI_MODE.VISUAL }
  }
  return { ...STATE, COMMAND_LINE: EMPTY_LINE, MODE: VI_MODE.VISUAL }
}

import type { ShellState, Command } from '../../types'
import { EMPTY, EMPTY_LINE, lineToString } from '../../utils'

export const historyUp = ({
  STATE,
  STATE: { HISTORY_INDEX, OLD_COMMANDS },
}: {
  STATE: ShellState
}): ShellState => {
  const history = OLD_COMMANDS.filter(
    ({ COMMAND_LINE }: Command) => lineToString(COMMAND_LINE) !== EMPTY,
  ).reverse()
  if (HISTORY_INDEX < history.length - 1) {
    HISTORY_INDEX += 1
  }

  return {
    ...STATE,
    HISTORY_INDEX,
    COMMAND_LINE: history.length ? history[HISTORY_INDEX].COMMAND_LINE : { ...EMPTY_LINE },
  }
}

export const historyDown = ({
  STATE,
  STATE: { HISTORY_INDEX, OLD_COMMANDS },
}: {
  STATE: ShellState
}): ShellState => {
  const history = OLD_COMMANDS.filter(
    ({ COMMAND_LINE }: Command) => lineToString(COMMAND_LINE) !== EMPTY,
  ).reverse()
  if (HISTORY_INDEX > -1) {
    HISTORY_INDEX -= 1
  }
  return {
    ...STATE,
    HISTORY_INDEX,
    COMMAND_LINE: HISTORY_INDEX === -1 ? { ...EMPTY_LINE } : history[HISTORY_INDEX].COMMAND_LINE,
  }
}

import type { ShellState, ViState, Line } from '../../types'
import { getEnv, write } from '../fs'
import { separate } from '../path'
import { echo, cd, ls, cat, rm, touch } from '../bin'
import { EMPTY, EMPTY_LINE, lineToString } from '../../utils'
import { startVi } from '../vi'

const cmds: Record<string, (args: string[]) => string> = {
  echo,
  cd,
  ls,
  pwd: () => 'dummy',
  cat,
  rm,
  touch,
}

const run = (cmd: string, args: string[]) => {
  if (cmd === EMPTY) return
  if (!cmds[cmd]) return `sh: command not found: ${cmd}`
  if (cmd === 'pwd') return `${getEnv('PWD')}/`

  const hasRedirect = args.indexOf('>')

  if (hasRedirect > -1) {
    const stdout = cmds[cmd](args.slice(0, hasRedirect))
    write({
      ...separate(
        args
          .slice(hasRedirect + 1)
          .join(' ')
          .trim(),
      ),
      obj: stdout,
    })
    return
  }

  return cmds[cmd](args)
}

const runFullScreen = ({
  STATE,
  cmd,
  args,
}: {
  STATE: ShellState
  cmd: string
  args: string[]
}) => {
  if (cmd === 'vi') return startVi({ STATE, args })
}

const FULL_SCREEN_APPS = ['vi']

export function parseCmd(input: Line) {
  // TODO escapes, quoting, flags, expansions, pipes
  const commandTokens = lineToString(input).split(' ')
  const cmd = commandTokens?.[0] ?? ''
  const args = commandTokens.slice(1)

  return { cmd, args }
}

export const evaluate = ({
  STATE,
  STATE: { COMMAND_LINE, OLD_COMMANDS, USER, PWD },
}: {
  STATE: ShellState
}): ViState | ShellState => {
  const { cmd, args } = parseCmd(COMMAND_LINE)
  const isFullScreen = FULL_SCREEN_APPS.includes(cmd)
  const STDOUT = isFullScreen ? EMPTY : run(cmd, args) ?? EMPTY

  OLD_COMMANDS = [...OLD_COMMANDS, { COMMAND_LINE, STDOUT, PWD, USER }]

  return isFullScreen
    ? runFullScreen({ STATE: { ...STATE, OLD_COMMANDS }, cmd, args })
    : {
        ...STATE,
        COMMAND_LINE: EMPTY_LINE,
        PWD: getEnv('PWD'),
        OLD_COMMANDS,
      }
}

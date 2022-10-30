import type { ShellState, State } from '../types'
import { getEnv, write } from './fs'
import { separate } from './path'
import { echo, cd, ls, cat, rm, touch } from './bin'
import { EMPTY, EMPTY_LINE, lineToString, parseCmd } from '../utils'
import { startVi } from './vi'

export const evaluate = (STATE: State) => {
  const { COMMAND_LINE, OLD_COMMANDS, USER } = STATE as ShellState

  const { cmd, args } = parseCmd(COMMAND_LINE)
  const wd = getEnv('PWD')

  if (cmd === 'vi') return startVi({ STATE, args, wd })

  const cmds: Record<string, (args: string) => string> = {
    echo,
    cd,
    ls,
    pwd: () => 'dummy',
    cat,
    rm,
    touch,
  }

  const run = () => {
    if (cmd === EMPTY) return

    if (!cmds[cmd]) return `sh: command not found: ${cmd}`
    if (cmd === 'pwd') return `${getEnv('PWD')}/`

    const hasRedirect = args.indexOf('>')

    if (hasRedirect > -1) {
      const stdout = cmds[cmd](args.slice(0, hasRedirect).join(' ').trim())
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

    // TODO and then pass args as string[]
    return cmds[cmd](args.join(' '))
  }

  const stdout = run()

  return {
    ...STATE,
    COMMAND_LINE: EMPTY_LINE,
    PWD: getEnv('PWD'),
    OLD_COMMANDS: [...OLD_COMMANDS, { cmd: lineToString(COMMAND_LINE), stdout, wd, usr: USER }],
  }
}

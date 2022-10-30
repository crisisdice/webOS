import { getEnv, write } from '../fs'
import { separate } from '../path'
import { echo, cd, ls, cat, rm, touch } from '../bin'
import { EMPTY } from '../../utils'

export const evaluate = (cmd: string, args: string[]) => {
  if (cmd === EMPTY) return

  const cmds: Record<string, (args: string) => string> = {
    echo,
    cd,
    ls,
    pwd: () => 'dummy',
    cat,
    rm,
    touch,
  }

  // TODO command parsing, .i.e. flags, different args, shell expansions, pipes, quotes

  if (!cmds[cmd]) return `sh: command not found: ${cmd}`
  if (cmd === 'pwd') return `${getEnv('PWD')}/`

  const hasRedirect = args.indexOf('>')

  if (hasRedirect > -1) {
    const stdout = cmds[cmd](args.slice(0, hasRedirect).join(' ').trim())
    write({ ...separate(args.slice(hasRedirect + 1).join(' ').trim()), obj: stdout })
    return
  }

  // TODO and then pass args as string[]
  return cmds[cmd](args.join(' '))
}

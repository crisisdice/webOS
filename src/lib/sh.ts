import { getEnv, setEnv, setFs, write } from './fs'
import { separate } from './utils'
import { EMPTY, PWD, HOME } from './constants'
import { echo, cd, ls, cat, rm, touch } from './bin'

export const init = () => {
  setEnv(PWD, '/home/guest')
  setEnv(HOME, '/home/guest')

  setFs({
    home: {
      guest: {
        '.bashrc': '#!/usr/sh',
        '.history': '',
      },
      root: {},
    },
  })
  console.log('initalized')
}

export const evaluate = (input: string) => {
  if (input === EMPTY) return

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
  // TODO and then pass args as string[]
  const cmd = (input.split(' ')?.[0] ?? input).trim()
  const argsI = input.indexOf(' ')
  const args = argsI === -1 ? EMPTY : input.slice(argsI + 1)

  if (!cmds[cmd]) return `sh: command not found: ${cmd}`
  if (cmd === 'pwd') return `${getEnv('PWD')}/`

  if (args.indexOf('>') > -1) {
    const tokens = args.split('>')
    const stdout = cmds[cmd](tokens[0].trim())
    write({ ...separate(tokens[1].trim()), obj: stdout })
    return
  }

  return cmds[cmd](args)
}

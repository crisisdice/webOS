import { setEnv, getEnv, stat } from './fs'

const EMPTY = ''

const echo = (args: string) => {
  return args.replaceAll('"', '')
}

const ls = (arg: string) => {
  const { exists, isDirectory, obj } = stat(arg)
  if (!exists) return `ls: cannot access '${arg}': No such file or directory`
  return isDirectory ? Object.keys(obj).join(' ') : arg.split('/').at(-1)
}

const cat = (arg: string): string => {
  const { exists, isDirectory, obj } = stat(arg)
  if (!exists) return `cat: cannot access '${arg}': No such file or directory`
  return isDirectory ? `cat: ${arg}: Is a directory` : (obj as string)
}

const cd = (args: string) => {
  const { exists, path } = stat(args)
  if (!exists) return `cd: no such file or directory: ${args}`
  setEnv('PWD', path)
}

export const evaluate = (input: string) => {
  if (input === EMPTY) return

  const cmds: Record<string, (...args: any[]) => string> = {
    echo,
    cd,
    ls,
    pwd: () => 'dummy',
    cat,
  }

  // TODO command parsing
  const cmd = (input.split(' ')?.[0] ?? input).trim()

  const argsI = input.indexOf(' ')
  const args = argsI === -1 ? EMPTY : input.slice(argsI + 1)

  if (!cmds[cmd]) return `sh: command not found: ${cmd}`

  if (cmd === 'pwd') return `${getEnv('PWD')}/`

  return cmds[cmd](args)
}

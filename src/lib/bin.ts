import { getEnv, setEnv, stat, write } from './fs'

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

const rm = (args: string) => {
  const { exists, path } = stat(args)
  if (!exists) return `rm: no such file or directory: ${args}`
  write({ ...separate(path), obj: null })
}

const touch = (args: string) => {
  const { exists } = stat(args)
  if (exists) return ''
  write({ ...separate(args), obj: '' })
}

const separate = (args: string): { name: string; path: string } => {
  if (args.indexOf('/') === -1) return { path: '.', name: args }
  const tokens = args.split('/')
  const path = tokens.slice(0, tokens.length - 1).join('/')
  return { name: tokens.at(-1), path }
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

import { setFs, setEnv, parsePath, getEnv, readDir } from './fs'

const EMPTY = ''

export const init = () => {
  setEnv('PWD', '/home/guest')
  setEnv('HOME', '/home/guest')

  setFs({
    'home': {
      'guest': {
        '.bashrc': '#!/usr/sh',
        '.history': ''
      },
      'root': {}
    }
  })
  console.log('initalized')
}

const echo = (args: string) => {
  return args.replaceAll('"', '')
}

const ls = (arg: string) => {
  return Object.keys(readDir(arg, 'ls')).join(' ')
}

const cat = (arg: string) => {
  const file = readDir('arg', 'cat')
  return (typeof file === 'string') 
    ? file
    : `cat: ${arg}: Is a directory`
}


const cd = (args: string) => {
  try {
    const tokens = parsePath(args === EMPTY ? '~' : args)
    readDir(args, 'cd')
    setEnv('PWD', '/' + tokens.join('/'))
  } catch {
    return `cd: no such file or directory: ${args}`
  }
}

export const evaluate = (input: string) => {
  if (input === EMPTY) return

  const cmds = {
    echo,
    cd,
    ls,
    pwd: 'dummy',
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

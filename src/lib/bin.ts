import { EMPTY } from '../utils'
import { setEnv, stat, write } from './fs'
import { separate } from './path'

// TODO whoami, login, mv

export const echo = (args: string[]) => {
  return args.join(' ').replaceAll('"', '')
}

export const ls = (args: string[]) => {
  const dir = args?.[0] ?? EMPTY
  // TODO ls: handle multiple dirs
  const { exists, isDirectory, obj } = stat(dir)
  if (!exists) return `ls: cannot access '${dir}': No such file or directory`
  return isDirectory ? Object.keys(obj).join(' ') : dir.split('/').at(-1)
}

export const cat = (args: string[]): string => {
  const file = args?.[0] ?? EMPTY
  // TODO cat: handle multiple files
  const { exists, isDirectory, obj } = stat(file)
  if (!exists) return `cat: cannot access '${file}': No such file or directory`
  return isDirectory ? `cat: ${file}: Is a directory` : (obj as string)
}

export const cd = (args: string[]) => {
  const dir = args?.[0] ?? EMPTY
  const { exists, path } = stat(dir)
  if (!exists) return `cd: no such file or directory: ${dir}`
  setEnv('PWD', path)
}

export const rm = (args: string[]) => {
  if (!args.length) return 'useage: rm file ...'
  const file = args[0]
  const { exists, path } = stat(file)
  if (!exists) return `rm: no such file or directory: ${file}`
  write({ ...separate(path), obj: null })
}

export const touch = (args: string[]) => {
  if (!args.length) return 'useage: touch file ...'
  const file = args[0]
  const { exists } = stat(file)
  if (exists) return ''
  write({ ...separate(file), obj: '' })
}

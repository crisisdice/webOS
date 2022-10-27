import { setEnv, stat, write } from './fs'
import { separate } from './utils'

export const echo = (args: string) => {
  return args.replaceAll('"', '')
}

export const ls = (arg: string) => {
  const { exists, isDirectory, obj } = stat(arg)
  if (!exists) return `ls: cannot access '${arg}': No such file or directory`
  return isDirectory ? Object.keys(obj).join(' ') : arg.split('/').at(-1)
}

export const cat = (arg: string): string => {
  const { exists, isDirectory, obj } = stat(arg)
  if (!exists) return `cat: cannot access '${arg}': No such file or directory`
  return isDirectory ? `cat: ${arg}: Is a directory` : (obj as string)
}

export const cd = (args: string) => {
  const { exists, path } = stat(args)
  if (!exists) return `cd: no such file or directory: ${args}`
  setEnv('PWD', path)
}

export const rm = (args: string) => {
  const { exists, path } = stat(args)
  if (!exists) return `rm: no such file or directory: ${args}`
  write({ ...separate(path), obj: null })
}

export const touch = (args: string) => {
  const { exists } = stat(args)
  if (exists) return ''
  write({ ...separate(args), obj: '' })
}

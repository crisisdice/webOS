import { FS, ENV } from './constants'
import type { ENV as IENV, Directory, Stat } from './types'

function get<T>(lsKey: 'ENV' | 'FS'): T | null {
  const ls = localStorage.getItem(lsKey)
  if (!ls) return null
  return JSON.parse(ls) as T
}

const absoluteTokens = (path: string) => path.split('/').filter((t) => !!t)

function parsePath(path: string): string[] {
  if (path === '') throw new Error('no path')
  if (path[0] === '/') return absoluteTokens(path)

  const pwdTokens = absoluteTokens(getEnv('PWD'))

  const pathTokens = path.split('/').filter((t) => !!t)

  let stack = [...pwdTokens]

  for (const token of pathTokens) {
    if (token === '.') {
      continue
    }

    if (token === '~') {
      stack = absoluteTokens(getEnv('HOME'))
      continue
    }

    if (token === '..') {
      if (stack.pop() === undefined) {
        throw new Error('path error')
      }
      continue
    }

    stack.push(token)
  }

  return stack
}

function traverse(tokens: string[], fs: Directory) {
  let tmp = fs

  for (const token of tokens) {
    tmp = tmp[token] as Directory
    if (tmp === undefined) throw new Error('dir does not exist')
  }

  return tmp
}

export function setFs(fs: Directory): void {
  localStorage.setItem(FS, JSON.stringify(fs))
}

export function getEnv(key: keyof IENV): string {
  return get<IENV>(ENV)[key] ?? ''
}

export function setEnv(key: string, value: string): void {
  const env = get<IENV>(ENV) ?? {}
  localStorage.setItem(ENV, JSON.stringify({ ...env, [key]: value }))
}

export function write({
  path,
  name,
  obj,
}: {
  path: string
  name: string
  obj: string | Directory | null
}) {
  const fs = get<Directory>(FS)
  const location = traverse(parsePath(path), fs)

  if (obj === null) {
    delete location[name]
  } else {
    location[name] = obj
  }

  setFs(fs)
}

export function stat(args: string): Stat {
  try {
    const fs = get<Directory>(FS)
    const tokens = parsePath(args === '' ? getEnv('PWD') : args)
    const path = '/' + tokens.join('/')
    const obj = traverse(tokens, fs)
    return { exists: true, path, isDirectory: typeof obj !== 'string', obj }
  } catch (e) {
    return { exists: false, path: '-', isDirectory: false, obj: '-' }
  }
}

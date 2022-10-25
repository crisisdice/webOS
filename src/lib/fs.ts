const ENV = 'ENV'
const FS = 'FS'

export const init = () => {
  setEnv('PWD', '/home/guest')
  setEnv('HOME', '/home/guest')

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

type ENV = {
  PWD: string
  HOME: string
}

type Directory = Record<string, string | Object>

function get<T>(lsKey: 'ENV' | 'FS'): T | null {
  const ls = localStorage.getItem(lsKey)
  if (!ls) return null
  return JSON.parse(ls) as T
}

function setFs(fs: Directory): void {
  localStorage.setItem(FS, JSON.stringify(fs))
}

export function getEnv(key: keyof ENV): string {
  return get<ENV>(ENV)[key] ?? ''
}

export function setEnv(key: string, value: string): void {
  const env = get<ENV>(ENV) ?? {}
  localStorage.setItem(ENV, JSON.stringify({ ...env, [key]: value }))
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
    if (!tmp) throw new Error('dir does not exist')
  }

  return tmp
}

export function write(path: string, name: string, obj: string | Directory | null) {
  const fs = get<Directory>(FS)
  const location = traverse(parsePath(path), fs)

  if (obj === null) {
    delete location[name]
  } else {
    location[name] = obj
  }

  setFs(fs)
}

type Stat = {
  exists: boolean
  path: string
  isDirectory: boolean
  obj: Directory | string
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

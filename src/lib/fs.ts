import type { ENV as IENV, Directory, Stat } from '../types'
import { FS, ENV, PWD, HOME } from '../utils'
import { absoluteTokens } from './path'

function get<T>(lsKey: 'ENV' | 'FS'): T | null {
  const ls = localStorage.getItem(lsKey)
  if (!ls) return null
  return JSON.parse(ls) as T
}

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

export function getEnv(key: keyof IENV): string {
  return get<IENV>(ENV)[key] ?? ''
}

export function setEnv(key: string, value: string): void {
  const env = get<IENV>(ENV) ?? {}
  localStorage.setItem(ENV, JSON.stringify({ ...env, [key]: value }))
}

export function setFs(fs: Directory): void {
  // TODO save with dir name as key and contents as value
  localStorage.setItem(FS, JSON.stringify(fs))
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

export function stat(pathString: string, name?: string): Stat {
  try {
    const fs = get<Directory>(FS)
    const tokens = [...parsePath(pathString === '' ? getEnv('PWD') : pathString)]
    if (name) tokens.push(name)
    const path = '/' + tokens.join('/')
    const obj = traverse(tokens, fs)
    return { exists: true, path, isDirectory: typeof obj !== 'string', obj }
  } catch (e) {
    return { exists: false, path: '-', isDirectory: false, obj: '-' }
  }
}

export function init() {
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
}

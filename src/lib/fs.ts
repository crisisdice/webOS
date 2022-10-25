const ENV = 'ENV'
const FS = 'FS'

type ENV = {
  PWD: string
  HOME: string
}

type Directory = Record<string, string | Object>

function get<T>(lsKey: 'ENV' | 'FS'): T {
  const ls = localStorage.getItem(lsKey)
  if (!ls) throw new Error('ENV not set')
  return JSON.parse(ls) as T
}

export function setFs(fs: Directory): void {
  localStorage.setItem(FS, JSON.stringify(fs))
}

function _getEnv(key: keyof ENV): string {
  return get<ENV>(ENV)[key] ?? ''
}

export const getEnv = _getEnv.bind(_getEnv)

function _setEnv(key: string, value: string): void {
  localStorage.setItem(ENV, JSON.stringify({ ...get<ENV>(ENV), [key]: value }))
}

export const setEnv = _setEnv.bind(_setEnv)

const absoluteTokens = (path: string) => path.split('/').filter(t => !!t)

export function parsePath(path: string): string[] {
  if (path === '') throw new Error('no path')

  if (path[0] === '/') return absoluteTokens(path)

  const pwdTokens = absoluteTokens(
    getEnv('PWD')
  )

  const pathTokens = path.split('/').filter(t => !!t)

  let stack = [ ...pwdTokens ]

  for (const token of pathTokens) {
    if (token === '.') {
      continue
    }

    if (token === '~') {
      stack = absoluteTokens(
        getEnv('HOME')
      )
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

export function traverse(tokens: string[], fs: Directory) {
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

export function readDir(path: string, caller: string): Directory | string {
  try { 
    const fs = get<Directory>(FS)
    return traverse(
      parsePath(path === ''
        ? getEnv('PWD')
        : path
      ),
      fs
    )
  } catch (e) {
    return `${caller}: cannot access '${path}': No such file or directory`
  }
}

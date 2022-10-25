const DEBUG = false
const ENV = 'ENV'
const FS = 'FS'

const debug = (...args: any[]) => {
  if (DEBUG) console.log(args)
}

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

function _getEnv(key: keyof ENV): string {
  debug(this.name, { key })
  return get<ENV>(ENV)[key] ?? ''
}

export const getEnv = _getEnv.bind(_getEnv)

function _setEnv(key: string, value: string): void {
  debug(this.name, { key, value })
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

export function traverse(tokens: string[]) {
  const fs = get<Directory>(FS)


}

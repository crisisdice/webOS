const DEBUG = false

const debug = (...args: any[]) => {
  if (DEBUG) console.log(args)
}

function _getEnv(key: string): string {
  debug(this.name, { key })
  return '/home/guest'
}

const getEnv = _getEnv.bind(_getEnv)

function _setEnv(key: string, value: string): void {
  debug(this.name, { key, value })
}

const setEnv = _setEnv.bind(_setEnv)

const absoluteTokens = (path: string) => path.split('/').filter(t => !!t)

function parsePath(path: string): string[] {
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

function test() {
  console.log(parsePath('/'))
  console.log(parsePath('~'))
  console.log(parsePath('~/'))
  console.log(parsePath('/home/root/'))
  console.log(parsePath('/home/root'))
  console.log(parsePath('../root'))
  console.log(parsePath('../root/'))
  console.log(parsePath('/etc/'))
  console.log(parsePath('/etc/'))
  console.log(parsePath('./documents'))
  console.log(parsePath('../../root/documents'))
}

test()

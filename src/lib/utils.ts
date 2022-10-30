import type { Line } from './types'
import { DASH } from './constants'

export const separate = (args: string): { name: string; path: string } => {
  if (args.indexOf('/') === -1) return { path: '.', name: args }
  const tokens = args.split('/')
  const path = tokens.slice(0, tokens.length - 1).join('/')
  return { name: tokens.at(-1), path }
}

export const refocus = (e: Event) =>
  window.setTimeout(() => (e.target as HTMLInputElement).focus(), 0)

export const lineToString = ({ PRECARET, CARET, POSTCARET }: Line) => {
  return `${PRECARET}${CARET === DASH ? '' : CARET}${POSTCARET}`
}

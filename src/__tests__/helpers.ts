import type { ShellState, ViState } from '../types'
import { INITAL_STATE } from '../utils'
import { BACK, ENTER, LEFT, RIGHT } from './constants'

export function keySeq(
  sequence: string[],
  STATE: ShellState | ViState = { ...INITAL_STATE },
): ShellState | ViState {
  for (const key of sequence) {
    STATE = STATE.UP_MAPPING({ e: { key }, STATE })
  }
  return STATE
}

export const fill = (n: number, key: string) => [...(Array(n) as unknown[])].map(() => key)

export function prettyTestName(sequence: string[]) {
  let leftCount = 0
  let rightCount = 0
  let backCount = 0
  let name = ''

  for (const char of sequence) {
    if (char === LEFT) {
      leftCount += 1
      continue
    }

    if (leftCount > 0) {
      name += `<LEFT ${leftCount}>`
      leftCount = 0
    }

    if (char === RIGHT) {
      rightCount += 1
      continue
    }

    if (rightCount > 0) {
      name += `<RIGHT ${rightCount}>`
      rightCount = 0
    }

    if (char === BACK) {
      backCount += 1
      continue
    }

    if (backCount > 0) {
      name += `<BACK ${backCount}>`
      backCount = 0
    }

    if (char === ENTER) {
      name += '<ENTER>'
      continue
    }

    name += char
  }

  if (leftCount > 0) {
    name += `<LEFT ${leftCount}>`
  }
  if (rightCount > 0) {
    name += `<RIGHT ${rightCount}>`
  }

  if (backCount > 0) {
    name += `<BACK ${backCount}>`
  }

  return name
}

import type { State } from '../types'
import { INITAL_STATE } from '../utils'
import { ENTER, LEFT, RIGHT } from './constants'

function keySeq(sequence: string[], STATE: State = { ...INITAL_STATE }): State {
  for (const key of sequence) {
    STATE = STATE.UP_MAPPING({ e: { key }, STATE })
  }
  return STATE
}

export const fill = (n: number, key: string) => [...(Array(n) as unknown[])].map(() => key)

function prettyTestName(sequence: string[]) {
  let leftCount = 0
  let rightCount = 0
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

  return name
}

function fs() {
  return localStorage.getItem('FS')
}

function env() {
  return localStorage.getItem('ENV')
}

export const run = (sequence: string[]) => {
  test(prettyTestName(sequence), () => {
    expect(keySeq(sequence)).toMatchSnapshot()
    expect(fs()).toMatchSnapshot()
    expect(env()).toMatchSnapshot()
  })
}

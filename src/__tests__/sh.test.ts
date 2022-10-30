import { run, fill } from './helpers'
import { DOWN, ENTER, LEFT, RIGHT, UP } from './constants'
import { init } from '../utils'

const tests = [
  [...fill(3, LEFT), ...fill(3, RIGHT)],
  ['g', LEFT],
  [...'hello'.split(''), ...fill(5, LEFT), ...fill(6, RIGHT)],
  [...'echo'.split(''), ENTER, ...'ls'.split(''), ENTER, UP, UP, DOWN],
]

beforeEach(() => init())

for (const sequence of tests) {
  run(sequence)
}

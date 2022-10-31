import { run, fill } from '../helpers'
import { DOWN, ENTER, LEFT, RIGHT, UP } from '../constants'
import { init } from '../../utils'

const tests = [
  [...fill(3, LEFT), ...fill(3, RIGHT)],
  ['g', LEFT],
  [...'hello'.split(''), ...fill(5, LEFT), ...fill(6, RIGHT)],
  [...'hello'.split(''), ...fill(6, LEFT), ...fill(4, RIGHT)],
  [...'hello'.split(''), ...fill(5, LEFT), ...fill(7, RIGHT)],
  [...'hello'.split(''), ...fill(3, LEFT), ...fill(3, RIGHT)],
  [...'hello'.split(''), ...fill(7, LEFT), ...fill(7, RIGHT)],
  [...'hello'.split(''), ...fill(1, LEFT), ...fill(2, RIGHT)],
  [...'hello'.split(''), ...fill(2, LEFT), ...fill(1, RIGHT)],
  [...'echo'.split(''), ENTER, ...'ls'.split(''), ENTER, UP, UP, DOWN],
]

beforeEach(() => init())

for (const sequence of tests) {
  run(sequence)
}

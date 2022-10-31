import { run, fill } from '../helpers'
import { BACK, DOWN, ENTER, LEFT, RIGHT, UP } from '../constants'
import { init } from '../../utils'

const ENTER_VI = [...'vi'.split(''), ENTER]

const tests = [
  [...ENTER_VI, 'i', ...'hello'.split('')],
  [...ENTER_VI, 'i', ...'hello'.split(''), ...fill(6, LEFT), ...fill(6, RIGHT)],
  [...ENTER_VI, 'i', ...'hello'.split(''), '`'],
  [...ENTER_VI, 'i', ...'hello'.split(''), '`', ':', ...'cmd'],
  [...ENTER_VI, 'i', ...'hello'.split(''), '`', ':', ...'cmd', ...fill(6, LEFT), ...fill(6, RIGHT)],
  [...ENTER_VI, 'i', ...'hello'.split(''), ENTER, ...'hello world'.split(''), UP],
  [
    ...ENTER_VI,
    'i',
    ...'hello'.split(''),
    ENTER,
    ...'hello world'.split(''),
    UP,
    DOWN,
    ...fill(12, BACK),
  ],
]

beforeEach(() => init())

for (const sequence of tests) {
  run(sequence)
}

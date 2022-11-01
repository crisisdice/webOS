import { BACK, DOWN, ENTER, LEFT, RIGHT, UP } from './constants'
import { fill } from './helpers'

export const bin = [
  [...'echo hello'.split(''), ENTER],
  [...'cd /'.split(''), ENTER],
  [...'cd ~'.split(''), ENTER],
  [...'cd ../root'.split(''), ENTER],
  [...'touch hello.txt'.split(''), ENTER],
  [...'cat "hello" > hello.txt'.split(''), ENTER],
  [...'echo "hello" > hello.txt'.split(''), ENTER],
  [...'echo "hello" > ../hello.txt'.split(''), ENTER],
  [...'rm .bashrc'.split(''), ENTER],
  [...'rm ../root'.split(''), ENTER],
  [...'ls'.split(''), ENTER],
  [...'ls /'.split(''), ENTER],
]

export const sh = [
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

const ENTER_VI = [...'vi'.split(''), ENTER]

export const vi = [
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
  [...ENTER_VI, 'i', ...'hello world'.split(''), ...fill(5, LEFT), ENTER],
  [
    ...ENTER_VI,
    'i',
    ...'hello world'.split(''),
    '`',
    ':',
    ...'w out'.split(''),
    ENTER,
    '`',
    ':',
    'q',
    ENTER,
  ],
]

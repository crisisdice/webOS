import { run, fill } from './helpers'
import { LEFT, RIGHT } from './constants'
import { init } from '../lib/sh'

const tests = [
  [...fill(3, LEFT), ...fill(3, RIGHT)],
  ['g', LEFT],
  [...'hello'.split(''), ...fill(5, LEFT), ...fill(6, RIGHT)],
]

beforeEach(() => init())

for (const sequence of tests) {
  run(sequence)
}

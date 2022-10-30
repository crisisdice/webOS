import { run } from './helpers'
import { ENTER } from './constants'
import { init } from '../lib/sh'

const tests = [
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

beforeEach(() => init())

for (const sequence of tests) {
  run(sequence)
}

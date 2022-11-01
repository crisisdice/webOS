import { INITAL_STATE } from '../utils'
import { init } from '../lib'
import { keySeq, prettyTestName } from './helpers'

export const runAll = (tests: string[][]) => {
  beforeEach(() => init())

  for (const sequence of tests) {
    test(prettyTestName(sequence), () => {
      expect(keySeq(sequence, { ...INITAL_STATE })).toMatchSnapshot()
      expect(localStorage.getItem('FS')).toMatchSnapshot()
      expect(localStorage.getItem('ENV')).toMatchSnapshot()
    })
  }
}

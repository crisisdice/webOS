import '@testing-library/jest-dom'

import { render } from '@testing-library/svelte'
import { prettyTestName, keySeq } from './helpers'
import { init } from '../lib'

import App from '../App.svelte'

export const runAll = (tests: string[][]) => {
  beforeEach(() => init())

  for (const sequence of tests) {
    test(prettyTestName(sequence), () => {
      const STATE = keySeq(sequence)
      const { container } = render(App, { STATE })
      expect(container.outerHTML).toMatchSnapshot()
    })
  }
}

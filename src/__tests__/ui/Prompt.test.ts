import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/svelte'
import Prompt from '../../components/Prompt.svelte'

it('renders prompt', () => {
  render(Prompt, { USER: 'test', PWD: '/home/test' })
  const user = screen.getByText('test@127.0.0.1')
  const pwd = screen.getByText('~/')
  expect(user).toBeInTheDocument()
  expect(pwd).toBeInTheDocument()
})

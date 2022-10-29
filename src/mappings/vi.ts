import { standardUp } from './index'
import type { State } from '../lib/types'
export const viUp = ({
  e: { key },
  STATE,
  STATE: { FULL_SCREEN, APP_NAME, UP_MAPPING },
}: {
  e: KeyboardEvent
  STATE: State
}): State => {
  console.log({ key, mapping: 'vi', STATE })

  switch (key) {
    case 'q': {
      FULL_SCREEN = false
      APP_NAME = null
      UP_MAPPING = standardUp
      break
    }
    default: {
      console.log('default')
    }
  }

  return { ...STATE, FULL_SCREEN, APP_NAME, UP_MAPPING }
}

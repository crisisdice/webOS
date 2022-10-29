import { standardUp, standardDown } from './mappings'
import { DASH, EMPTY } from './lib/constants'
import type { AppState, State } from './lib/types'

export const EMPTY_LINE = Object.freeze({
  PRECARET: EMPTY,
  CARET: DASH,
  POSTCARET: EMPTY,
  CARET_ACTIVE: false,
})

export const INITAL_APP_STATE: AppState = {
    CONTROL_DOWN: false,
    FULL_SCREEN: false,
    NAME: 'sh',
    UP_MAPPING : standardUp,
    DOWN_MAPPING : standardDown,
}

export const INITAL_STATE: State = {
  OLD_COMMANDS: [],
  APP_STATE: INITAL_APP_STATE,
  COMMAND_LINE: EMPTY_LINE,
  USER : 'guest',
  PWD : '/home/guest',
}

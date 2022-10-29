import { standardUp, standardDown } from './mappings'
import { DASH } from './lib/constants'
import type { State } from './lib/types'

export const INITAL_STATE: State = {
  CONTROL_DOWN: false,
  OLD_COMMANDS: [],
  FULL_SCREEN: false,
  APP_NAME: null,
  APP_STATE: {},
  UP_MAPPING : standardUp,
  DOWN_MAPPING : standardDown,
  PRECARET : '',
  CARET : DASH,
  POSTCARET : '',
  CARET_ACTIVE : false,
  USER : 'guest',
  PWD : '/home/guest',
}

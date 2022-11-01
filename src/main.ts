import './app.css'
import App from './App.svelte'
import { INITAL_STATE } from './utils'

const app = new App({
  target: document.getElementById('app'),
  props: { STATE: { ...INITAL_STATE } },
})

export default app

// test-utils.js
import { App, createApp } from 'vue'

function withSetup<T>(composable: Function) {
  let result
  const app = createApp({
    setup() {
      result = composable()
      // suppress missing template warning
      return () => {}
    },
  })
  app.mount(document.createElement('div'))
  // return the result and the app instance
  // for testing provide / unmount
  return [result as unknown, app] as [T, App<Element>]
}

export default withSetup

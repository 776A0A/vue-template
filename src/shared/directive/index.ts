export { directive as emptyDirective } from './empty'
export { directive as errorDirective } from './error'
export { directive as focusDirective } from './focus'
export { directive as loadingDirective } from './loading'
export * from './types'
export * from './utils'
export {
  EmptyDirectivePlugin,
  ErrorDirectivePlugin,
  FocusDirectivePlugin,
  LoadingDirectivePlugin,
}

import { Plugin } from 'vue'
import EmptyDirectivePlugin from './empty'
import ErrorDirectivePlugin from './error'
import FocusDirectivePlugin from './focus'
import LoadingDirectivePlugin from './loading'

export const DirectivePlugin: Plugin = {
  install(app) {
    const plugins = [
      EmptyDirectivePlugin,
      ErrorDirectivePlugin,
      FocusDirectivePlugin,
      LoadingDirectivePlugin,
    ]

    plugins.forEach((plugin) => plugin.install?.(app))
  },
}

// TODO directive 能不能做类型提示？

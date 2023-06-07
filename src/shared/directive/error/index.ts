import ErrorView from '@/components/ErrorView/index.vue'
import { isBoolean } from '@/shared/tools'
import type { Plugin } from 'vue'
import { PlaceholderDirectiveValue } from '../types'
import { createDirective, genInstanceKey } from '../utils'

export const directive = createDirective({
  INSTANCE_KEY: genInstanceKey(`error`),
  component: ErrorView,
  getProps,
})

export default <Plugin>{
  install: (app) => app.directive('error', directive),
}

function getProps(binding: PlaceholderDirectiveValue) {
  if (isBoolean(binding.value)) return { show: binding.value }
  else
    return {
      errorMessage: binding.value.text,
      wrapperStyle: binding.value.style,
      show: binding.value.value,
    }
}

import EmptyView from '@/components/EmptyView/index.vue'
import { isBoolean } from '@/shared/tools'
import type { Plugin } from 'vue'
import {
  PlaceholderDirectiveBaseProps,
  PlaceholderDirectiveValue,
} from '../types'
import { createDirective, genInstanceKey } from '../utils'

interface Props extends PlaceholderDirectiveBaseProps {
  img?: string
}

type BindingValue = PlaceholderDirectiveValue<Props>

export const directive = createDirective({
  INSTANCE_KEY: genInstanceKey(`empty`),
  component: EmptyView,
  getProps,
})

export default <Plugin>{
  install: (app) => app.directive('empty', directive),
}

function getProps(binding: BindingValue) {
  if (isBoolean(binding.value)) return { show: binding.value }
  else
    return {
      ...binding.value,
      show: binding.value.value,
      wrapperStyle: binding.value.style,
      showText: binding.value.text !== null,
    }
}

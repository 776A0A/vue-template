import LoadingView from '@/components/LoadingView/index.vue'
import { invoke, isBoolean, isElement } from '@/shared/tools'
import { DirectiveBinding, ObjectDirective, Plugin } from 'vue'
import {
  PlaceholderDirectiveBaseProps,
  PlaceholderDirectiveValue,
} from '../types'
import { createInstance, genInstanceKey, isChanged } from '../utils'

interface Props extends PlaceholderDirectiveBaseProps {
  fullscreen?: boolean | undefined
  delay?: boolean | undefined
}

type BindingValue = PlaceholderDirectiveValue<Props>

export const INSTANCE_KEY = genInstanceKey(`loading`) as `__v_loading_instance`
const POS_CHANGED_KEY = `__v_loading_pos_changed`

interface BLoadingElement extends HTMLElement {
  [INSTANCE_KEY]: any
  [POS_CHANGED_KEY]: boolean
}

export const directive: ObjectDirective<BLoadingElement> = {
  mounted(el, binding) {
    if (!isElement(el)) return

    el[INSTANCE_KEY] = createInstance(LoadingView, getProps(binding))

    setElPos(el, binding)

    el.appendChild(el[INSTANCE_KEY].$el)
  },
  updated(el, binding) {
    if (!isElement(el)) return

    setElPos(el, binding)

    if (isBoolean(binding.value)) el[INSTANCE_KEY].$data.loading = binding.value
    else {
      Object.assign(el[INSTANCE_KEY].$data, getPropsFromObjBinding(binding))
    }
  },
  unmounted(el) {
    invoke(() => {
      el[POS_CHANGED_KEY] = false
      el[INSTANCE_KEY] = null
      el?.remove()
    })
  },
}

function getProps(binding: BindingValue) {
  if (isBoolean(binding.value)) return { loading: binding.value }
  else return getPropsFromObjBinding(binding as any)
}

export default <Plugin>{
  install: (app) => app.directive('loading', directive),
}

function setElPos(el: any, binding: DirectiveBinding<any>) {
  if (!isChanged(binding)) return

  const isInvalidPos = () =>
    !el.style.position || el.style.position === 'static'

  const validate = isBoolean(binding.value)
    ? () => binding.value && isInvalidPos()
    : () => binding.value.value && isInvalidPos()

  if (validate()) {
    el[POS_CHANGED_KEY] = true
    el.style.position = 'relative'
  } else {
    if (el[POS_CHANGED_KEY]) {
      el[POS_CHANGED_KEY] = false
      el.style.position = ''
    }
  }
}

function getPropsFromObjBinding(binding: DirectiveBinding<Props>) {
  return {
    ...binding.value,
    tip: binding.value.text,
    wrapperStyle: binding.value.style,
    loading: binding.value.value,
  }
}

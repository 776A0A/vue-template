import { invoke, isBoolean, isElement } from '@/shared/tools'
import { createApp, h, ObjectDirective } from 'vue'
import {
  PlaceholderDirectiveBaseProps,
  PlaceholderDirectiveValue,
} from './types'

export function createInstance<D>(Component: any, data: D) {
  return createApp({
    data: () => data,
    render() {
      return h(Component, this.$data)
    },
  }).mount(document.createElement('div'))
}

export function isChanged(binding: PlaceholderDirectiveValue) {
  if (isBoolean(binding.value)) return binding.value !== binding.oldValue
  else
    return (
      binding.value.value !==
      (binding.oldValue as PlaceholderDirectiveBaseProps)?.value
    )
}

export function getValue(binding: PlaceholderDirectiveValue) {
  return isBoolean(binding.value) ? binding.value : binding.value.value
}

export function createDirective({
  INSTANCE_KEY,
  component,
  getProps,
}: {
  INSTANCE_KEY: string
  component: any
  getProps: (binding: PlaceholderDirectiveValue) => any
}) {
  interface VElement extends HTMLElement {
    [instanceKey: string]: any
  }

  const directive: ObjectDirective<VElement> = {
    mounted(el, binding) {
      if (!isElement(el)) return

      const instance = createInstance(component, getProps(binding))

      el[INSTANCE_KEY] = instance
      el.insertBefore(instance.$el, el.children?.[0])
    },
    updated(el, binding) {
      if (!isElement(el)) return

      Object.assign(el[INSTANCE_KEY].$data, getProps(binding))
    },
    unmounted(el) {
      invoke(() => {
        el[INSTANCE_KEY] = null
        el?.remove()
      })
    },
  }

  return directive as ObjectDirective
}

export function genInstanceKey(name: string) {
  return `__v_${name}_instance` as const
}

import { isElement } from '@/shared/tools'
import { Plugin } from 'vue'

export function directive(el: HTMLInputElement, binding: { value: unknown }) {
  if (!isElement(el)) return
  if (binding.value === false) el.blur()
  else el.focus()
}

export default <Plugin>{
  install: (app) => app.directive('focus', directive),
}

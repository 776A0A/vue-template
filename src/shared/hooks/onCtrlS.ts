import { useEventListener } from '@vueuse/core'

export function onCtrlS(callback: AnyFunction, condition?: () => boolean) {
  useEventListener(
    'keydown',
    (evt) => {
      const { ctrlKey, key } = evt
      if (!ctrlKey || key !== `s`) return
      if (condition && !condition()) return

      evt.preventDefault()
      evt.stopImmediatePropagation()
      evt.stopPropagation()

      callback()
    },
    { capture: true }
  )
}

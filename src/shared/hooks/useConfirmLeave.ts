import { useEventListener } from '@vueuse/core'
import { onBeforeRouteLeave } from 'vue-router'

export function useConfirmLeave(args: {
  /**
   * 返回 true 则表示同意离开
   */
  check: () => boolean
  /**
   * 离开页面的提示信息，默认：确认离开页面？
   */
  message?: string
  /**
   * 确认离开页面后的回调函数
   */
  callback?: VoidFunction
}) {
  useEventListener('beforeunload', confirm)

  onBeforeRouteLeave(() => {
    if (args.check()) return true

    const answer = window.confirm(`${args.message ?? '确认离开页面？'}`)

    if (!answer) return false

    args.callback?.()

    return true
  })

  function confirm(evt: BeforeUnloadEvent) {
    if (args.check()) return

    evt.preventDefault()

    evt.returnValue = ''
  }
}

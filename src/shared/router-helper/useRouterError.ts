import { invoke, logging } from '@/shared/tools'
import { ref } from 'vue'
import { progress } from './RouterGuards'

export function useRouterError(validator?: () => boolean) {
  const error = ref(false)

  return { error, handleError }

  function handleError(error: any) {
    progress.stop()

    const errorPrefix = 'Error from router: \n'
    const message = error?.message ? (error.message as string) : error

    invoke(() => {
      logging.error(`${errorPrefix}`)
      logging.error(message)
    })

    if (validator?.()) return
    // 中断的路由不做处理
    if ((message as string).toLowerCase().includes('abort')) return

    error.value = true
  }
}

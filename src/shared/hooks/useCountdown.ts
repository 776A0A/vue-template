import { onUnmounted, shallowReactive } from 'vue'

interface Params {
  duration?: number
  step?: number
  endCb?: () => void
}

/**
 * 倒计时hook
 * @param params.duration - 倒计时时间，默认 60s
 * @param params.step - 倒计时递减的值，默认为 1
 * @param params.endCb - 倒计时结束的回调函数，可选
 */
export const useCountdown = ({
  duration = 60,
  step = 1,
  endCb,
}: Params = {}) => {
  let timer: NodeJS.Timeout
  const stepTime = step * 1000
  const countdown = shallowReactive({
    time: duration,
    started: false,
  }) as { time: number; started: boolean }

  const start = () => {
    countdown.started = true

    if (countdown.time - step <= 0) {
      // 为了让页面不会显示0
      timer = setTimeout(() => {
        clear()
        // 在下一轮时间循环中重置，避免页面中在本轮事件循环中显示初始值
        setTimeout(() => (countdown.time = duration))
        endCb?.()
      }, stepTime)
    } else {
      timer = setTimeout(() => {
        countdown.time--
        start()
      }, stepTime)
    }
  }

  const clear = () => {
    countdown.started = false
    clearTimeout(timer)
  }

  const stop = () => {
    clear()
    countdown.time = duration
  }

  try {
    if (process.env.NODE_ENV !== 'test') onUnmounted(stop)
  } catch (_error) {
    onUnmounted(stop)
  }

  return Object.assign(countdown, { start, stop })
}

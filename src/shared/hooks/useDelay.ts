import { Ref, ref, watch } from 'vue'
import { runAfter } from '../tools/runAfter'

export function useDelay(loading: Ref<boolean>, time = 300) {
  const delay = ref(true)

  const un = watch(loading, (is) => {
    if (is) return
    runAfter(() => {
      delay.value = false
      un()
    }, time)
  })

  return { delay }
}

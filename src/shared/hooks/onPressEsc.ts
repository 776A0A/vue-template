import { useMagicKeys } from '@vueuse/core'
import { watch } from 'vue'

export const onPressEsc = (watcher: (pressed: boolean) => void) => {
  const { Escape } = useMagicKeys()
  watch(Escape, watcher)
}

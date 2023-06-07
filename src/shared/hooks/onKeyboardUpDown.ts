import { downIdx, upIdx } from '@/shared/tools'
import { onKeyStroke } from '@vueuse/core'

export default function onKeyboardUpDown({
  current,
  length,
  callback,
  condition,
}: {
  current: () => number
  length: () => number
  callback: (idx: number) => void
  condition?: () => boolean
}) {
  onKeyStroke('ArrowUp', () => {
    if (condition && !condition()) return
    if (length() <= 1) return

    callback(upIdx(current(), length()))
  })

  onKeyStroke('ArrowDown', () => {
    if (condition && !condition()) return
    if (length() <= 1) return

    callback(downIdx(current(), length()))
  })
}

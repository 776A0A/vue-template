import { onMounted, onUnmounted, Ref, ref } from 'vue'

export const useElemWidth = (wrapperElem: Ref<HTMLElement | undefined>) => {
  const wrapperWidth = ref(0)

  onMounted(() => {
    window.addEventListener('resize', handleResize)
    handleResize()
  })

  onUnmounted(() => window.removeEventListener('resize', handleResize))

  return { wrapperWidth }

  function getWrapperWidth() {
    return wrapperElem.value?.getBoundingClientRect().width ?? 0
  }

  function handleResize() {
    wrapperWidth.value = getWrapperWidth()
  }
}

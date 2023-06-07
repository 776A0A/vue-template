import debounce from 'lodash.debounce'
import { ref, Ref } from 'vue'

let pageWidth = 0,
  pageHeight = 0

const handleResize = debounce(() => {
  const size = document.documentElement.getBoundingClientRect()
  pageWidth = size.width
  pageHeight = size.height
}, 150)

const MASK_Z_INDEX = 99

export const useDrag = (elem: Ref<HTMLElement | undefined>) => {
  const elemInfo = { x: 0, y: 0, top: 0, left: 0, width: 0, height: 0 }
  const stopped = ref(true) // 主要用来避免和点击事件冲突
  let mask: HTMLDivElement | null = null

  handleResize()
  window.addEventListener('resize', handleResize)

  const dragging = ref(false)

  const dragStart = (evt: MouseEvent) => {
    if (!elem.value) return

    dragging.value = true
    const { top, left, width, height } = elem.value.getBoundingClientRect()

    elemInfo.x = evt.pageX
    elemInfo.y = evt.pageY
    elemInfo.top = top
    elemInfo.left = left
    elemInfo.width = width
    elemInfo.height = height

    // 时间很短，说明是click
    setTimeout(() => {
      if (!dragging.value) return
      appendMaskToBody()
      attachListeners()
    }, 100)
  }
  const dragMove = (evt: MouseEvent) => {
    if (!dragging.value || !elem.value) return

    stopped.value = false

    let eTop = elemInfo.top + evt.pageY - elemInfo.y
    let eLeft = elemInfo.left + evt.pageX - elemInfo.x

    if (eTop < 0) eTop = 0
    if (eLeft < 0) eLeft = 0
    const overTop = eTop + elemInfo.height - pageHeight
    if (overTop > 0) eTop = eTop - overTop
    const overLeft = eLeft + elemInfo.width - pageWidth
    if (overLeft > 0) eLeft = eLeft - overLeft

    Object.assign(elem.value.style, {
      top: suffixPx(eTop),
      left: suffixPx(eLeft),
      right: 'auto',
      bottom: 'auto',
    })
  }

  const dragEnd = (evt: MouseEvent) => {
    if (!dragging.value) return
    evt.stopPropagation()

    dragging.value = false
    elemInfo.x =
      elemInfo.y =
      elemInfo.top =
      elemInfo.left =
      elemInfo.width =
      elemInfo.height =
        0

    detachListeners()
    removeMaskFromBody()

    setTimeout(() => (stopped.value = true))
  }

  return { dragStart, dragging, dragEnd, stopped, MASK_Z_INDEX }

  function attachListeners() {
    mask?.addEventListener('mousemove', dragMove)
    mask?.addEventListener('mouseup', dragEnd)
    mask?.addEventListener('mouseleave', dragEnd)
  }
  function detachListeners() {
    mask?.removeEventListener('mousemove', dragMove)
    mask?.removeEventListener('mouseup', dragEnd)
    mask?.removeEventListener('mouseleave', dragEnd)
  }

  function appendMaskToBody() {
    document.body.appendChild((mask = createMask()))
  }

  function removeMaskFromBody() {
    if (!mask) return
    document.body.removeChild(mask)
    mask = null
  }
}

function suffixPx(str: string | number) {
  return `${str}px`
}

function createMask() {
  const mask = document.createElement('div')
  Object.assign(mask.style, {
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: MASK_Z_INDEX,
  })
  return mask
}

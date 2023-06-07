import { runAfter } from './runAfter'

export function highlightWithScroll(target: HTMLElement | null) {
  highlight(target, { scrollInto: true })
}

export function highlightByAttribute(target: HTMLElement | null) {
  highlight(target, { useAttribute: true })
}

export function highlightByAttributeWithScroll(target: HTMLElement | null) {
  highlight(target, { scrollInto: true, useAttribute: true })
}

export function highlight(
  target: HTMLElement | null,
  {
    scrollInto = false,
    useAttribute = false,
  }: { scrollInto?: boolean; useAttribute?: boolean } = {}
) {
  if (scrollInto) scrollIntoView(target)
  if (!useAttribute) setHighlightByClassName(target)
  else setHighlightByAttribute(target)
}

function scrollIntoView(target: HTMLElement | null) {
  target?.scrollIntoView({ block: 'start' })
}

function setHighlightByAttribute(target: HTMLElement | null) {
  target?.setAttribute('highlight', 'true')
  removeHighlight(() => target?.removeAttribute('highlight'))
}

function setHighlightByClassName(target: HTMLElement | null) {
  target?.classList.add('highlight')
  removeHighlight(() => target?.classList.remove('highlight'))
}

function removeHighlight(remove: VoidFunction) {
  runAfter(remove, 2000)
}

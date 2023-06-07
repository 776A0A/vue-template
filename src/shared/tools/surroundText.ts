// 查找传入 el 的前后文
export function surroundText(el: HTMLElement, length = 30) {
  const ret = { prefix: '', suffix: '' }

  const parent = el.parentElement
  if (!parent) return ret

  const nodes = Array.from(parent.childNodes)

  const pos = nodes.findIndex((node) => node === el)
  if (pos === -1) return ret

  ret.prefix = nodes.slice(0, pos).reduce(concatElText, '').slice(-length)
  ret.suffix = nodes
    .slice(pos + 1)
    .reduce(concatElText, '')
    .slice(0, length)

  return ret

  function concatElText(text: string, node: Node) {
    return `${text}${node.textContent}`
  }
}

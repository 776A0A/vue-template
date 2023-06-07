/**
 * 统一url，没有带http前缀的会自动根据当前协议添加
 */
export function normalizeURL(url: string) {
  return /^https?:\/\//.test(url) ? url : `${location.protocol}//${url}`
}

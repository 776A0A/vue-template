/**
 * 生成随机 id
 * @param prefix - 自定义 id 前缀，默认空串
 */
export function genId(prefix = '') {
  return `${prefix}${Math.random().toString(36).slice(2)}`
}

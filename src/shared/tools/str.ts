/**
 * 获取字符串，处理可能出现的 undefined 或者 null
 * @param value
 * @param trim 是否要清楚前后空格，默认 true
 */
export function str(value?: unknown, trim = true) {
  const _value = String(value ?? '')

  return trim ? _value.trim() : _value
}

/**
 * 对于字符串会 trim 后计算长度，对于 nullable 值回返回 0
 * @param value 任何值
 * @returns
 */
export function strLen(value?: unknown) {
  return str(value).length
}

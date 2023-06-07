export function isElement(value: unknown): value is Element {
  return value instanceof Element
}

/**
 * 判断是否是 null 或 undefined
 * @param value
 * @returns
 */
export function isNullable(value: unknown): value is null | undefined {
  return value === null || value === void 0
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}

export function isObject(value: unknown): value is object {
  return Object.prototype.toString.call(value) === '[object Object]'
}

/**
 * ⚠️ 此判断会将 localhost 视为 https
 */
export const isHttps = () =>
  location.protocol === 'https:' || location.hostname === 'localhost'

export const isHttp = () => location.protocol === 'http:'

/**
 * 判断一个 uri 是否是 http 协议
 * @param uri
 */
export const isHttpURI = (uri: string) => /^http:/.test(uri.trim())

const agent = () => window.navigator.userAgent.toLowerCase()

export const isFirefox = () => agent().includes('firefox')
export const isEdge = () => agent().includes('edg')
export const isChrome = () =>
  agent().includes('chrome') &&
  !isSafari() &&
  !isEdge() &&
  !is360() &&
  !is360JiSu() &&
  !isHuaWei() &&
  !isSouGou()
export const isSafari = () =>
  agent().includes('safari') && !agent().includes('chrome')
export const is360 = () => agent().includes('qihu')
export const is360JiSu = () => agent().includes('chrome/95')
export const isHuaWei = () => agent().includes('hbpc')
export const isSouGou = () => agent().includes('metasr')

export function simpleEncrypt(v: any) {
  return window.btoa(window.encodeURIComponent(JSON.stringify(v)))
}

export function simpleDecrypt<T = unknown>(v: any) {
  return JSON.parse(window.decodeURIComponent(window.atob(v))) as T
}

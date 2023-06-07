/**
 * 新建指定长度的数组
 */
export function array<T>(length: number, callback: (i: number) => T) {
  return Array.from({ length }, (_, i) => callback(i))
}

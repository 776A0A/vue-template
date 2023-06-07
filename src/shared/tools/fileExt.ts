/**
 * 解析文件后缀
 * @param filename - 文件名
 * @param original - 是否保留原始后缀，默认 false，会将解析到的后缀转换为小写
 */
export function fileExt(filename: string, original = false) {
  const ext = filename.includes('.') ? filename.split('.').pop() ?? '' : ''
  return original ? ext.trim() : ext.trim().toLocaleLowerCase()
}

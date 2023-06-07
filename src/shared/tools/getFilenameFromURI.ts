/**
 * 从字符串中解析文件名
 * @param uri
 */
export function getFilenameFromURI(uri: string) {
  const parts = uri
    .trim()
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean)

  return parts.at(-1)
}

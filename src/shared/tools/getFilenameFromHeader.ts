/**
 * 将会从 attachment;filename= 这个 header 中尝试提取文件名
 * @param headers
 * @param defaultName - 默认名称，可选
 * @returns
 */
export function getFilenameFromHeader(headers: NormalObj, defaultName = '') {
  const fileNameHeader = headers?.['content-disposition']

  return fileNameHeader
    ? decodeURIComponent(fileNameHeader.replace('attachment;filename=', ''))
    : defaultName
}

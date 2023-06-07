import { getFilenameFromHeader } from './getFilenameFromHeader'
import { getFilenameFromURI } from './getFilenameFromURI'

export const DEFAULT_FILENAME = '文件'

type Filename = string | (() => string)

/**
 * 下载文件
 * @param file
 * @param filename - 文件名或者一个返回文件名的函数
 */
export async function download(file: Blob | string, filename?: Filename) {
  let a = document.createElement('a')

  let blob: Blob,
    finalFilename = getFilename(file, filename)

  if (typeof file === 'string') {
    const result = await getBlob(file)

    blob = result.blob

    if (finalFilename === DEFAULT_FILENAME)
      finalFilename = result.filename ?? DEFAULT_FILENAME
  } else {
    blob = file
  }

  const url = window.URL.createObjectURL(blob)

  void (
    [
      ['href', url],
      ['download', finalFilename],
      ['target', '_blank'],
    ] as const
  ).forEach(([attr, val]) => a.setAttribute(attr, val))

  a.click()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  a = null

  window.URL.revokeObjectURL(url)
}

export function getFilename(file: Blob | string, filename?: Filename) {
  return typeof filename === 'function'
    ? filename()
    : typeof filename === 'string'
    ? filename
    : filename === undefined && typeof file === 'string'
    ? getFilenameFromURI(file) ?? DEFAULT_FILENAME
    : DEFAULT_FILENAME
}

async function getBlob(file: string) {
  let filename: string | undefined | null

  const blob = await fetch(file).then((res) =>
    res
      .blob()
      .then((blob) => {
        filename = getFilenameFromHeader(
          Object.fromEntries(res.headers.entries())
        )

        return blob
      })
      .catch(() => tryCreateIFrame(file))
  )

  return { blob: blob, filename }
}

function tryCreateIFrame(maybeURL: string) {
  let params: [BlobPart[], BlobPropertyBag] = [
    [maybeURL],
    { type: 'text/plain;charset=utf-8' /* 纯文本 */ },
  ]

  if (/^https?:\/\//.test(maybeURL)) {
    params = [[getIframeHTML(maybeURL)], { type: 'text/html' /* iframe */ }]
  }

  return new window.Blob(...params)
}

function getIframeHTML(url: string) {
  return `
  <html>
    <body style="margin:0px;">
      <iframe src=${url} frameborder="0" style="height:100vh;width:100vw;border:none;margin:0px;"></iframe>
    </body>
  </html>
  `
}

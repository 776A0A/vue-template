type ErrorHandler1 = (error: string | Event | null, file?: File) => void

export function urlToFile(url: string): Promise<File>
export function urlToFile(url: string, callback: ErrorHandler1): void
export function urlToFile(url: string, callback?: ErrorHandler1) {
  const getMimeType = (res: Response) => {
    return res.headers.get('content-type') ?? 'image/png'
  }
  const createFile = (blob: Blob, type: string) => {
    return new File([blob], `图片.${type.split('/')[1] ?? 'png'}`, { type })
  }

  if (callback) {
    fetch(url).then((res) =>
      res
        .blob()
        .then((blob) => callback(null, createFile(blob, getMimeType(res))))
        .catch((error) => callback(error))
    )

    return
  }

  return fetch(url).then((res) =>
    res.blob().then((blob) => createFile(blob, getMimeType(res)))
  )
}

type ErrorHandler = (
  error: string | Event | null,
  image: HTMLImageElement
) => void

export function urlToImage(url: string): Promise<HTMLImageElement>
export function urlToImage(url: string, callback: ErrorHandler): void
export function urlToImage(url: string, callback?: ErrorHandler) {
  const image = new Image()
  image.src = url

  if (callback) {
    image.onload = () => callback(null, image)
    image.onerror = (error) => callback(error, image)
  } else {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      image.onload = () => resolve(image)
      image.onerror = reject
    })
  }
}

/**
 * 将blob转化为base64字符串
 * @param {Blob} blob - 文件或 blob 对象
 * @param callback - 转换完后的回调函数
 */
export function fileToBase64(
  blob: Blob,
  callback: (error: ProgressEvent<FileReader> | null, url?: string) => void
) {
  const reader = new FileReader()

  reader.addEventListener(
    'load',
    () => callback(null, reader.result as string),
    { once: true }
  )
  reader.addEventListener('error', (error) => callback(error), { once: true })

  reader.readAsDataURL(blob)
}

export function imageToBase64(image: HTMLImageElement) {
  const canvas = document.createElement('canvas')

  canvas.width = image.naturalWidth || image.width
  canvas.height = image.naturalHeight || image.height

  const ctx = canvas.getContext('2d')

  image.crossOrigin = 'Anonymous'

  ctx?.drawImage(image, 0, 0, canvas.width, canvas.height)

  return canvas.toDataURL('image/png')
}

export function base64ToFile(url: string, filename = '图片') {
  const arr = url.split(',')
  const bstr = window.atob(arr[1])

  let length = bstr.length
  const u8arr = new Uint8Array(length)

  while (length--) {
    u8arr[length] = bstr.charCodeAt(length)
  }

  const type = url.match(/^data:image\/(.+);base64,.+/)?.[1] ?? 'png'

  return new File([u8arr], `${filename}.${type}`, { type: `image/${type}` })
}

export function base64ToImage(url: string) {
  const image = new Image()
  image.src = url

  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image)
    image.onerror = reject
  })
}

/**
 *
 * @param sBase64
 * @param decode - 是否需要 decode 字符，默认 false
 * @returns
 */
export function base64ToArrayBuffer(sBase64: string, decode = false) {
  const str = window.atob(decode ? window.decodeURIComponent(sBase64) : sBase64)
  const length = str.length
  const bytes = new Uint8Array(length)

  for (let i = 0; i < length; i++) {
    bytes[i] = str.charCodeAt(i)
  }

  return bytes.buffer
}

/**
 *
 * @param ab
 * @param encode - 是否需要 encode 字符，默认 false
 * @returns
 */
export function arrayBufferToBase64(ab: ArrayBuffer, encode = false) {
  const bytes = new Uint8Array(ab)
  const length = bytes.byteLength

  let binary = ''

  for (let i = 0; i < length; i++) {
    binary += String.fromCharCode(bytes[i])
  }

  return window.btoa(encode ? window.encodeURIComponent(binary) : binary)
}

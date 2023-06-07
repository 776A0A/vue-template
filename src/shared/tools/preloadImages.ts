/**
 * 提前请求并解码图片，避免在挂载到dom后再进行解码而造成的卡顿
 * @param images 图片的 url 数组
 * @returns
 */
export function preloadImages(images: string[]) {
  if (!('decode' in Image.prototype)) return

  return Promise.allSettled(images.map(decodeImage))

  function decodeImage(url: string) {
    const img = new Image()
    img.src = url
    return img.decode()
  }
}

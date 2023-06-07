import { base64ToFile } from './base64'
import { fileToBase64 } from './image'
import { invoke } from './invoke'
import { urlToFile } from './url'

interface Options {
  preprocess?: () => boolean | undefined | void
  done: (image: File, url: string, extraData?: string) => void
  onerror?: (error: unknown) => void
}

export function pasteImage(evt: ClipboardEvent, options: Options) {
  evt.preventDefault()
  if (!evt.clipboardData) return

  const image = evt.clipboardData.files[0] as File | undefined

  if (image && !image.type.startsWith('image')) return

  const goOn = options?.preprocess?.()

  if (goOn === false) return

  if (image && image instanceof File) {
    const extraData = getPlainText(evt)

    return fileToBase64(image, (error, url) => {
      if (error) return options.onerror?.(error)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      options.done(image, url!, extraData)
    })
  }

  const url = getPlainText(evt)

  if (/^data:image\/.+;base64,.+/.test(url)) {
    return invoke(() => {
      const file = base64ToFile(url)

      options.done(file, url)
    }, options.onerror)
  } else if (url !== '') {
    tryResolveAsNetImage(url)
      .then(({ image, url }) => options.done(image, url))
      .catch(options.onerror)

    return
  } else {
    console.log(`非法的格式：${url}`)
  }

  function tryResolveAsNetImage(url: string) {
    return new Promise<{ image: File; url: string; evt: ClipboardEvent }>(
      (resolve, reject) => {
        urlToFile(url, (error, file) => {
          if (error) return reject(error)

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          resolve({ image: file!, url, evt })
        })
      }
    )
  }
}

function getPlainText(evt: ClipboardEvent) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return evt.clipboardData!.getData('text/plain')
}

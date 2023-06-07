import SM from 'spark-md5'

/**
 * 计算文件的 md5 值
 */

self.onmessage = (evt) => {
  const { blob } = evt.data as { blob: Blob }

  const spark = new SM.ArrayBuffer()
  const reader = new FileReader()

  reader.onload = (e) => {
    spark.append((e.target as FileReader).result as ArrayBuffer)

    self.postMessage({ md5: spark.end() })
  }

  reader.onerror = (error) => {
    self.postMessage({
      error,
      message: !blob.type ? `无法解析该类型文件` : `未知错误`,
    })
  }

  reader.readAsArrayBuffer(blob)
}

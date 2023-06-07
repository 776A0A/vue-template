import { ArrayBuffer as AB } from 'spark-md5'

// TODO fileMd5 使用 worker 优化

/**
 * 计算文件的 md5 值
 */
export function fileMd5(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const spark = new AB()
    const reader = new FileReader()

    reader.onload = (e) => {
      spark.append((e.target as FileReader).result as ArrayBuffer)

      resolve(spark.end())
    }

    reader.onerror = (err) => {
      if (!blob.type) reject('无法解析该类型文件')
      else reject(err)
    }

    reader.readAsArrayBuffer(blob)
  })
}

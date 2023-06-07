import { logging } from './logging'

/**
 * @param cb - 需要包裹的函数
 * @param [fallback] - 可选的错误处理函数
 */
export function invoke<T extends (...args: any[]) => any>(
  cb: T,
  fallback?: (error: any) => void
): ReturnType<T> | void {
  try {
    return cb()
  } catch (error: any) {
    logging.error(error.message, error)

    fallback?.(error)
  }
}

/**
 * 处理异步函数的错误，可捕获 rejected 和 throw 的错误
 * @param cb - 需要包裹的函数
 * @param [fallback] - 可选的错误处理函数
 */
export async function invokeAsync<T extends (...args: any[]) => any>(
  cb: T,
  fallback?: (error: any) => void
): Promise<ReturnType<T> | void> {
  try {
    return await Promise.resolve(cb())
  } catch (error: any) {
    logging.error(error?.message)

    fallback?.(error)
  }
}

/**
 * @param message - 打印的信息
 */
export function error(message: string, error?: any) {
  console.log(`%c${message}`, 'color:red')
  if (error) console.log(error)
}

export const logging = { error }

/**
 * 并发请求
 * @param argv
 * @param argv.parallel - 最大并发数
 * @param argv.total - 总共的请求数
 * @param argv.request - 请求函数，将会接收到 idx 为第几个请求
 */
export async function concurrent(argv: {
  parallel: number
  total: number
  request: (idx: number) => Promise<void>
}) {
  const { parallel, total, request } = argv

  return new Promise<void>((resolve) => {
    let frees = parallel ?? 0
    let idx = 0
    let counter = 0
    const len = total

    const start = () => {
      while (frees > 0 && idx < len) {
        frees--
        request(idx++).then(() => {
          frees++
          counter++
          if (counter === len) resolve()
          else start()
        })
      }
    }

    start()
  })
}

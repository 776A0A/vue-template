/**
 *
 * @param callback - 循环动作
 * @param options - 配置选项
 * @param options.predicate - 循环终止条件函数，返回 boolean，如果不传入则表示无限循环
 * @param options.duration - 循环间隔，最小值 16ms，默认 1000ms
 * @returns
 */
export function repeat(
  callback: () => MaybePromise<unknown>,
  {
    duration = 1000,
    predicate = () => true,
  }: { duration?: number; predicate?: () => boolean } = {}
) {
  let timer: NodeJS.Timer

  return { start, stop }

  function start() {
    if (!predicate()) return

    const res = callback()

    if (res instanceof Promise) res.finally(() => (timer = genTimer()))
    else timer = genTimer()

    function genTimer() {
      return setTimeout(start, Math.max(16, duration))
    }
  }

  function stop() {
    clearTimeout(timer)
  }
}

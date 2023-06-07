export function runAfter(cb: AnyFunction, time = 0) {
  setTimeout(cb, time)
}

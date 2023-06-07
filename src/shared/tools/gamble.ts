/**
 * 随机概率返回 true/false，默认概率 50%，可传入 0-1 之间的任意数调整概率
 * @param p - 概率，传入越大，返回 true 可能性越高
 */
export function gamble(p = 0.5) {
  return p >= 1 ? true : p <= 0 ? false : Math.random() < p
}

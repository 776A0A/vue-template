/**
 * 获取当前索引的上一个索引，如果是 0，则返回最后一个索引
 * @param idx - 当前索引
 * @param length - 列表总长度
 */
export function upIdx(idx: number, length: number) {
  return idx === 0 ? length - 1 : idx - 1
}

/**
 * 获取当前索引的下一个索引，如果是最后一个，则返回最第一个索引
 * @param idx - 当前索引
 * @param length - 列表总长度
 */
export function downIdx(idx: number, length: number) {
  return idx === length - 1 ? 0 : idx + 1
}

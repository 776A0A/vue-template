/**
 * 获取和源对象中不一样的值
 * @param originalObj - 源对象
 * @param copiedObj - 目标对象
 * @param customDiffer - 自定义筛选器，返回 true 表示相同，返回 false 表示不同，返回 undefined 表示交给内部筛选器处理
 * @returns 返回不一样值的对象
 */
export function diffValue<T extends Record<keyof any, any>, U = Partial<T>>(
  originalObj: T,
  copiedObj: U,
  customDiffer?: <K extends keyof U>(
    key: K,
    originalValue: U[K],
    copiedValue: U[K]
  ) => boolean | void
) {
  const diff: Partial<T> = {}

  Object.entries(copiedObj as Partial<T>).forEach(([key, value]) => {
    const result = customDiffer?.(key as keyof U, originalObj[key], value)

    if (
      (result === undefined && value !== originalObj[key as keyof T]) ||
      result === false
    ) {
      diff[key as keyof T] = value
    }
  })

  return diff
}

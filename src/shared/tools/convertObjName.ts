type ConvertObjName = <
  T extends NormalObj,
  R extends { readonly [K in keyof T]?: string }
>(
  originalObj: T,
  namesMap: Readonly<R>
) => RecordWithSwappedKey<T, R>

// TODO convertObjName 递归改变名称

/**
 * 转换对象的名称
 * @param obj - 源对象
 * @param namesMap - 目标key的对象
 * @returns 替换后的对象，源对象中被替换的key将会删除，同时保留类型
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const convertObjName: ConvertObjName = (obj, namesMap) => {
  if (!obj || typeof obj !== 'object') return obj

  const convertedObj = {} as ReturnType<ConvertObjName>

  Object.keys(obj).forEach((key) => {
    if (namesMap[key]) {
      convertedObj[namesMap[key as keyof typeof namesMap]] = obj[key]
    } else {
      convertedObj[key] = obj[key]
    }
  })

  return convertedObj
}

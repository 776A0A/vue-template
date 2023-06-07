import { RouteLocationNormalized, START_LOCATION } from 'vue-router'

/**
 * 1. 只改变 query 时不会显示进度条
 *
 * 2. 在初始加载时显示进度条
 */
export function needLoading(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) {
  const toLastMatched = to.matched[to.matched.length - 1]?.path
  const fromLastMatched = from.matched[from.matched.length - 1]?.path

  return toLastMatched !== fromLastMatched || from === START_LOCATION
}

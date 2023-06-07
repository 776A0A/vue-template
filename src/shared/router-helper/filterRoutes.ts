import { Router, RouteRecordRaw } from 'vue-router'
import { NA, TA } from './constants'

/**
 *
 * @param router
 * @param routes - 传入 createRouter 中的 routes
 * @param reachables - 扁平的路由权限数组
 * @param customFilter - 可自定过滤逻辑，返回非布尔类型将把处理权交还给默认逻辑
 */
export function filterRoutes(
  router: Router,
  routes: RouteRecordRaw[],
  reachables: string[],
  customFilter?: (
    reachables: string[],
    routePath: string
  ) => boolean | undefined
) {
  routes.forEach((route) => {
    let deleted = false

    const hasResult = customFilter?.(reachables, route.path)

    if (typeof hasResult === 'boolean') {
      if (!hasResult) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        router.removeRoute(route.name!)
        deleted = true
      }
    } else {
      if (
        route.meta?.[NA] &&
        route.meta?.[TA] !== true &&
        !reachables.some((authPath) => route.path.startsWith(authPath))
      ) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        router.removeRoute(route.name!)
        deleted = true
      }
    }

    if (!deleted && route.children)
      filterRoutes(router, route.children, reachables, customFilter)
  })
}

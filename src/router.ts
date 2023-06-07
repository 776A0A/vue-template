import { createPaths } from '@/shared/router-helper'
import { progress } from '@/shared/tools'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import WIP from './components/WIP/index.vue'

export const { routeNames, paths } = createPaths({})

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    component: WIP,
    children: [
      {
        path: '',
        name: 'x',
        children: [
          { path: '', name: 'x', component: WIP },
          { path: `:id`, name: '', component: WIP },
        ],
      },
    ],
  },
  {
    path: '/:path(.*)*',
    component: () => import('@/components/NotFound/index.vue'),
  },
]

export const router = createRouter({ routes, history: createWebHashHistory() })

router.beforeEach(() => {
  progress.start()
})

router.afterEach((to) => {
  document.title = `${to.meta.title as string}`
  progress.stop()
})

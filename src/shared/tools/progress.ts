import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

export const progress = {
  start: () => nProgress.start(),
  stop: () => nProgress.done(),
}

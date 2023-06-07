import { isNullable } from '@/shared/tools'
import { ref } from 'vue'

/**
 * 返回包装过后的mutate函数，可自动处理loading、error
 * @param queryFn - 请求函数，一般为 post 请求
 */
export const useMutation = <T extends (...params: any[]) => Promise<any>>(
  queryFn: T,
  options?: {
    preventParallel?: boolean
  }
) => {
  const loading = ref(false)
  const error = ref('')

  if (options && isNullable(options?.preventParallel))
    options.preventParallel = true

  const mutate: (
    ...params: Parameters<T>
  ) => Promise<Awaited<ReturnType<T>>> = async (...params) => {
    if (options?.preventParallel && loading.value) return

    loading.value = true
    error.value = ''

    return queryFn(...params)
      .catch((err: any) => Promise.reject((error.value = err)))
      .finally(() => (loading.value = false))
  }

  return { loading, error, mutate }
}

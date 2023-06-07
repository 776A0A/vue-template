import { isNullable } from '@/shared/tools'
import { useHttp } from './useHttp'

type BaseState = ReturnType<typeof useHttp>

export interface QueryOptions<T extends (...params: any[]) => Promise<any>> {
  defaultValue: Awaited<ReturnType<T>>
  cleanupOnFetch?: boolean
  initialLoading?: boolean
  preventParallel?: boolean
}

export function useQueryHelper<ExtraState extends NormalObj>(
  { beforeRequest, afterRequest, resolveRequest, rejectRequest, init } = {} as {
    init?: () => NormalObj | undefined
    beforeRequest?: (state: { state: BaseState & ExtraState }) => void
    resolveRequest?: (data: { state: BaseState & ExtraState; res: any }) => void
    rejectRequest?: (data: { state: BaseState & ExtraState; err: any }) => void
    afterRequest?: (state: { state: BaseState & ExtraState }) => void
  }
) {
  /**
   * 返回包装过后的query函数，可自动处理data、loading、error等
   * @param queryFn - 请求函数
   * @param options - 额外的参数
   * @param options.defaultValue - data 的默认值，必传
   * @param options.cleanupOnFetch - 是否在重新请求前清空数据，可选
   * @param options.initialLoading - 初始的loading值，默认 false
   * @param options.preventParallel - 是否防止并发请求，默认 true
   */
  const queryTemplate = <T extends (...params: any[]) => Promise<any>>(
    queryFn: T,
    _options: QueryOptions<T>
  ) => {
    const options = { ..._options }
    const baseState = useHttp(options)
    const { loading, error, data } = baseState
    const extraState = init?.()

    const state = { loading, error, data, ...extraState } as typeof baseState &
      ExtraState

    if (options.initialLoading) loading.value = true
    if (isNullable(options.preventParallel)) options.preventParallel = true

    const query: (
      ...params: Parameters<T>
    ) => Promise<Awaited<ReturnType<T>>> = async (...params) => {
      if (options.preventParallel && loading.value && !options.initialLoading)
        return

      options.initialLoading = false

      if (options.cleanupOnFetch) data.value = options.defaultValue

      loading.value = true
      error.value = ''

      beforeRequest?.({ state })

      return queryFn(...params)
        .then((res) => {
          resolveRequest?.({ res, state })
          return (data.value = res)
        })
        .catch((err: any) => {
          rejectRequest?.({ err, state })
          return Promise.reject((error.value = err))
        })
        .finally(() => {
          loading.value = false
          afterRequest?.({ state })
        })
    }

    const returnValue = { loading, error, data, query }

    return { ...returnValue, ...extraState } as typeof returnValue & ExtraState
  }

  return queryTemplate
}

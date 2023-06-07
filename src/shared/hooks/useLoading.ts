import { ref } from 'vue'

interface Options {
  initialLoading?: boolean
  preventParallel?: boolean
}

export const useLoading = <T extends (...args: any[]) => any>(
  fn: T,
  { initialLoading = false, preventParallel = true }: Options = {}
) => {
  const loading = ref(initialLoading)

  const query = async (
    ...args: Parameters<T>
  ): Promise<ReturnType<T> | void> => {
    if (loading.value && !initialLoading && preventParallel) return

    initialLoading = false
    loading.value = true

    const res = fn(...args)

    if (res instanceof Promise) {
      return res.finally(() => (loading.value = false))
    }

    loading.value = false
    return res
  }

  return { loading, query }
}

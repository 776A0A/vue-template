import { Ref, ref } from 'vue'

export const useHttp = <T>(options?: { defaultValue: T }) => {
  const loading = ref(false)
  const error = ref('')
  const data = ref(options?.defaultValue) as Ref<T>

  return { loading, error, data }
}

export function buildFormData<T extends O>(options: Readonly<T>) {
  const data = new FormData()

  Object.entries(options).forEach(([k, v]) => data.append(k, v))

  return data
}

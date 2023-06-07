import { invoke } from './invoke'
import { simpleEncrypt } from './simpleCrypto'

type GetDataFn = <T>(
  key: string,
  fallbackValue?: T,
  cb?: (error: any) => void
) => T | undefined

const ls = window.localStorage
const ss = window.sessionStorage

export const storageKey = simpleEncrypt('localStorage')
export const sessionStorageKey = simpleEncrypt('sessionStorage')

const session = {
  get: get.bind(null, ss) as GetDataFn,
  set: set.bind(null, ss),
  remove: remove.bind(null, ss),
  clear: clear.bind(null, ss),
  forEach: forEach.bind(null, ss),
}

export const storage = {
  get: get.bind(null, ls) as GetDataFn, // bind后泛型消失了，所以使用类型断言
  set: set.bind(null, ls),
  remove: remove.bind(null, ls),
  clear: clear.bind(null, ls),
  forEach: forEach.bind(null, ls),
  session,
  clearAll,
}

function forEach(
  storage: Storage,
  cb: (value: any, key: string, idx: number) => void
) {
  const keys = getKeys(storage)

  if (!keys.length) return

  keys.forEach((key, idx) => {
    const value = get(storage, key)

    cb(value, key, idx)
  })
}

function addKey(storage: Storage, key: string) {
  const keys = getKeys(storage)

  if (keys.includes(key)) return

  keys.push(key)

  storage.setItem(getStorageKey(storage), JSON.stringify(keys))
}

function removeKey(storage: Storage, key: string) {
  let keys = getKeys(storage)

  keys = keys.filter((_key) => _key !== key)

  storage.setItem(getStorageKey(storage), JSON.stringify(keys))
}

function clearKey(storage: Storage) {
  storage.removeItem(getStorageKey(storage))
}

function getKeys(storage: Storage) {
  return get(storage, getStorageKey(storage), [] as string[])
}

function getStorageKey(storage: Storage) {
  return storage === ls ? storageKey : sessionStorageKey
}

function get(storage: Storage, key: string): unknown
function get<T>(storage: Storage, key: string, fallbackValue: T): T
function get<T>(storage: Storage, key: string, fallbackValue?: T) {
  let value: T | undefined

  invoke(() => {
    const v = storage.getItem(key)

    if (v == null) {
      if (fallbackValue) {
        value = fallbackValue
        set(storage, key, value)
      }
      return
    }

    value = JSON.parse(v)
  })

  return value
}

function set(
  storage: Storage,
  key: string,
  value: any,
  cb?: (error: any) => void
) {
  invoke(
    () => {
      storage.setItem(key, JSON.stringify(value))
      addKey(storage, key)
    },
    (error) => {
      cb?.(error)
    }
  )
}

function remove(storage: Storage, key: string) {
  storage.removeItem(key)
  removeKey(storage, key)
}

function clear(storage: Storage) {
  forEach(storage, (_, key) => remove(storage, key))
  clearKey(storage)
}

function clearAll() {
  clear(ls)
  clear(ss)
}

import { storage } from './storage'

export interface JWTOptions {
  tokenKey?: string
}

interface Storage {
  get: (key: string) => string | undefined
  set: (key: string, val: string) => void
  remove: (key: string) => void
}

export class JWT {
  private _storage: Storage
  private _tokenKey = 'dG9rZW5LZXk%3D'

  constructor(options?: JWTOptions) {
    this._storage = storage

    if (options?.tokenKey) this._tokenKey = options.tokenKey
  }

  get() {
    return this._storage.get(this._tokenKey)
  }

  set(token: string) {
    token = token.trim()

    if (!token) return

    this._storage.set(this._tokenKey, token)
  }

  remove() {
    this._storage.remove(this._tokenKey)
  }
}

export function createJWT(options?: JWTOptions) {
  return new JWT(options)
}

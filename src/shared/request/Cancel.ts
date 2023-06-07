import { Canceler as _Canceler } from 'axios'

export class Canceler {
  private _cancelQueue = new Map<unknown, _Canceler>()
  private _cancelMessage = 'Request canceled.' as const

  add(id: unknown, canceler: _Canceler) {
    return this._cancelQueue.set(id, canceler)
  }

  shot(id?: unknown) {
    const cancelQueue = this._cancelQueue
    if (!cancelQueue.size) return

    if (id == null) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Array.from(cancelQueue).forEach(([_, canceler]) =>
        canceler(this._cancelMessage)
      )
      cancelQueue.clear()
    } else {
      cancelQueue.get(id)?.(this._cancelMessage)
      cancelQueue.delete(id)
    }
  }

  get message() {
    return this._cancelMessage
  }
}

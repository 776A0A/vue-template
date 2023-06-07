type ReceiveFn<T> = (data: MessageEvent<T>) => void

type DataType = string | ArrayBufferLike | Blob | ArrayBufferView

interface Options {
  onSuccess: (evt: Event) => void
  onFail: (evt: Event) => void
}

class WS<T> {
  private _socket: WebSocket | null = null
  private _options?: Options

  async connect(url: string, receiveFn: ReceiveFn<T>, options?: Options) {
    if (this._socket) return

    this._options = options
    this._socket = new WebSocket(url)

    await this._start(this._socket)

    this._startReceive(this._socket, receiveFn)
  }

  send(data: DataType) {
    this._socket?.send(data)
  }

  close() {
    this._socket?.close()
  }

  private _start(socket: WebSocket) {
    return new Promise<Event>((resolve, reject) => {
      socket.onopen = (evt) => {
        this._options?.onSuccess(evt)
        resolve(evt)
      }

      socket.onerror = (evt) => {
        this._options?.onFail(evt)
        reject(evt)
      }
    })
  }

  private _startReceive(socket: WebSocket, receiveFn: ReceiveFn<T>) {
    socket.onmessage = receiveFn
  }
}

export function createWs<T>() {
  return new WS<T>()
}

import { createNanoEvents, Unsubscribe, Emitter } from 'nanoevents'
import { onMounted, onUnmounted } from 'vue'

export class BaseEmitter<
  EventsMap extends NormalObj,
  Events extends keyof EventsMap = keyof EventsMap
> {
  protected _emitter: Emitter<EventsMap> = createNanoEvents<EventsMap>()

  on<E extends Events>(event: E, cb: EventsMap[E]) {
    return this._emitter.on(event, cb)
  }

  emit<E extends Events>(event: E, ...params: Parameters<EventsMap[E]>) {
    return this._emitter.emit(event, ...params)
  }

  clear() {
    this._emitter.events = {}
  }

  get events() {
    return this._emitter.events
  }
}

export class VueEmitter<
  EventsMap extends NormalObj
> extends BaseEmitter<EventsMap> {
  /**
   * 在 onUnmount 时自动卸载监听，可链式调用
   * @param immediate - 在创建组件时开始监听还是在 onMounted 后开始
   */
  autoUnbind<E extends keyof EventsMap>(
    event: E,
    cb: EventsMap[E],
    { immediate = true } = {}
  ) {
    let unbind: Unsubscribe

    if (immediate) unbind = this.on(event, cb)
    else onMounted(() => (unbind = this.on(event, cb)))

    onUnmounted(() => unbind?.())

    return this
  }
}

export function createVueEmitter<EventsMap extends NormalObj>() {
  return new VueEmitter<EventsMap>()
}

export function createEmitter<EventsMap extends NormalObj>() {
  return new BaseEmitter<EventsMap>()
}

import axios, { AxiosError, AxiosInstance } from 'axios'
import merge from 'lodash.merge'
import { Canceler } from './Cancel'
import { defaultOptions, unknownErrorMessage } from './constants'
import { Options, RequestConfig, RequestMethod, ResponseConfig } from './types'

export class Request<Urls extends string = string> {
  private _options: Options
  private _ins: AxiosInstance
  private _canceler = new Canceler()

  constructor(options: Options) {
    this._options = Object.assign({}, defaultOptions, options)

    this._ins = createRequestIns(this._options.baseURL)

    this._loadInterceptors()
  }

  private _loadInterceptors() {
    this._ins.interceptors.request.use(
      this._handleReq as any,
      this._options.onReqError ?? this._handleReqError
    )
    this._ins.interceptors.response.use(
      this._handleRes as any,
      this._handleResError
    )
  }

  private _handleReq = async (config: RequestConfig) => {
    this._options.beforeRequest?.(config)

    if (this._options.header) {
      config.headers = merge(config.headers, await this._options.header(config))
    }

    if (config.__cancelId != null) {
      config.cancelToken = new axios.CancelToken((canceler) => {
        this._canceler.add(config.__cancelId, canceler)
      })
    }

    return config
  }

  private _handleReqError = (error: unknown) => {
    if (this._options.noticeWhenReqError) {
      globalThis.alert(
        error && typeof error === 'object' && 'message' in error
          ? (error as any).message
          : unknownErrorMessage
      )
    }

    return Promise.reject(error)
  }

  private _handleRes = (_config: ResponseConfig) => {
    const { config, data: _data } = _config

    const data = this._options.transformResult(_data)

    const newConfig = Object.assign(_config, { data })

    if (config.skipResCheck) return newConfig

    const codes = this._options.codes
    const code = data.code

    return code == codes?.success
      ? data
      : this._options.onResError?.(
          newConfig,
          code,
          data.message ?? unknownErrorMessage
        ) ?? Promise.reject(newConfig)
  }

  private _handleResError = (error: AxiosError<any>) => {
    const {
      code = this._options.codes?.serverError,
      message = unknownErrorMessage,
    } = error.response?.data ?? {}
    const { noticeWhenResError, onTokenTimeout } = this._options

    const httpMessage = error.message
    if (httpMessage === this._canceler.message) {
      console.log(httpMessage)
      return {}
    }

    if (code == this.codes?.tokenTimeout) {
      return onTokenTimeout ? onTokenTimeout(error) : Promise.reject(error)
    }

    if (this._options.onResError)
      return this._options.onResError(error, code, message)

    if (noticeWhenResError) globalThis.alert(message)

    return Promise.reject(message)
  }

  get codes() {
    return this._options.codes
  }

  cancel(id?: unknown) {
    return this._canceler.shot(id)
  }

  do: RequestMethod<Urls> = (url, rest = {}) => this._ins(url, rest) as any

  get: RequestMethod<Urls> = (url, rest = {}) =>
    this.do(url, Object.assign(rest, { method: 'GET' })) as any

  post: RequestMethod<Urls> = (url, rest = {}) =>
    this.do(url, Object.assign(rest, { method: 'POST' })) as any

  put: RequestMethod<Urls> = (url, rest = {}) =>
    this.do(url, Object.assign(rest, { method: 'PUT' })) as any

  delete: RequestMethod<Urls> = (url, rest = {}) =>
    this.do(url, Object.assign(rest, { method: 'DELETE' })) as any

  patch: RequestMethod<Urls> = (url, rest = {}) =>
    this.do(url, Object.assign(rest, { method: 'PATCH' })) as any
}

function createRequestIns(baseURL: string) {
  return axios.create({ baseURL: baseURL })
}

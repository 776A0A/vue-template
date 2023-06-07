import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

export interface RequestConfig<T = unknown> extends AxiosRequestConfig<T> {
  skipResCheck?: boolean
  __cancelId?: unknown
}

export interface ResponseConfig<R = any, C = any>
  extends Omit<AxiosResponse<R, C>, 'config'> {
  config: RequestConfig
}

export type ExpectedResult<T = any> = {
  code: StringOrNumber
  message?: string
  result?: T
}

export interface Options {
  baseURL: string
  /**
   * 强制转换 api 返回数据结构
   */
  transformResult: (result: any) => ExpectedResult
  /**
   * 传入一个函数，可用于返回固定的 headers
   */
  header?: (config: RequestConfig) => NormalObj | Promise<NormalObj>
  codes?: {
    /**
     * 请求成功
     * @default 200
     */
    success: StringOrNumber
    /**
     * token 超时
     * @default 401
     */
    tokenTimeout: StringOrNumber
    /**
     * 服务器错误
     * @default 500
     */
    serverError: StringOrNumber
    [state: keyof any]: StringOrNumber
  }
  /**
   * 登录超时的处理函数
   */
  onTokenTimeout?: (error: AxiosError) => void
  /**
   * 响应发生错误时弹窗提示
   * @default true
   */
  noticeWhenResError?: boolean
  /**
   * 请求发生错误时弹窗提示
   * @default true
   */
  noticeWhenReqError?: boolean
  onReqError?: (error: unknown) => Promise<unknown | void>
  /**
   * 当 api 请求结果不符合预期时
   */
  onResError?: (
    config:
      | (ResponseConfig<any, any> & {
          data: ExpectedResult<any>
        })
      | AxiosError<any>,
    code: StringOrNumber,
    message: string
  ) => Promise<unknown | void>
  /**
   * 在发送请求前执行
   */
  beforeRequest?: (config: RequestConfig) => void
}

export type RequestMethod<Urls> = <Data = unknown>(
  url: Urls,
  rest?: RequestConfig
) => Promise<ExpectedResult<Data>>

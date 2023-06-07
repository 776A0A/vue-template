import { Options } from './types'
import { Request } from './Request'

export function createRequest<Urls extends string = string>(options: Options) {
  return new Request<Urls>(options)
}

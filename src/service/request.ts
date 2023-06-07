import { createRequest } from '@/shared/request'
import { convertObjName } from '@/shared/tools'
import { Endpoints } from './endpoints'
import { jwt } from './jwt'

interface Result {
  code: number
  message: string
  data: unknown
}

export const request = createRequest<Endpoints>({
  baseURL: __API_URL__ ?? '',
  transformResult: (result: Result) =>
    convertObjName(result, { data: 'result' }),
  header: () => ({ Authorization: jwt.get() ?? '' }),
})

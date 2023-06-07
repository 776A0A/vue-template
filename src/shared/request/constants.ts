export const defaultCodes = Object.freeze({
  success: 200,
  tokenTimeout: 401,
  serverError: 500,
} as const)

export const defaultOptions = Object.freeze({
  codes: defaultCodes,
  noticeWhenResError: true,
  noticeWhenReqError: true,
} as const)

export const unknownErrorMessage = 'unknown error.'

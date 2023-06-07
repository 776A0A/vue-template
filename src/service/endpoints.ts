export const endpoints = {} as const

export type Endpoints = (typeof endpoints)[keyof typeof endpoints]

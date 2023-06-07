/**
 * need-auth
 * @type symbol
 */
export const NA = Symbol('need-auth')
/**
 * temporary-allow
 * @type symbol
 */
export const TA = Symbol('temporary-allow')

/**
 * { need-auth: true }
 */
export const OA = Object.freeze({ [NA]: true } as const)

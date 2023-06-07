import { genId } from './genId'
import { simpleEncrypt } from './simpleCrypto'

export const TMP_ID_PREFIX = simpleEncrypt(`__tmp_id_`)

/**
 * 生成临时的 id
 */
export function genTmpId() {
  return `${TMP_ID_PREFIX}${genId()}`
}

/**
 * 生成临时的 name
 * @param prefix
 */
export function genTmpName(prefix = '') {
  return `${prefix}${prefix ? `_` : ``}${genId().slice(0, 4)}`
}

/**
 * 是否是临时生成 id
 * @param id
 */
export function isTmpId(id: string) {
  return id.startsWith(TMP_ID_PREFIX)
}

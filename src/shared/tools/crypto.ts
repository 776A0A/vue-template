import JSEncrypt from 'jsencrypt'

export function createCrypto(key: string) {
  const crypto = new JSEncrypt({})

  crypto.setPublicKey(key)

  return crypto
}

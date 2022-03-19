/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from 'crypto'

import jwt from 'jsonwebtoken'

const decryptToken = async (
  token: string
) => {
  const prCryptoAlgorithm = process.env.ENV_ALGORITHM;
  const prCryptoSecretKey = process.env.ENV_SECRET_KEY;

  if (!prCryptoAlgorithm || !prCryptoSecretKey) {
    throw new Error("Estão faltando informações para a geração do token");
  }

  const decrypt = (hash: any) => {
    const decipher = crypto.createDecipheriv(
      prCryptoAlgorithm,
      prCryptoSecretKey,
      Buffer.from(hash.iv, 'hex')
    )

    const decrpyted = Buffer.concat([
      decipher.update(Buffer.from(hash.content, 'hex')),
      decipher.final(),
    ])

    return JSON.parse(decrpyted.toString())
  }

  let decoded


  decoded = jwt.verify(token, prCryptoSecretKey)

  return decrypt(decoded)
}

export { decryptToken }

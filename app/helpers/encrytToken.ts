import crypto from "crypto";

import jwt from "jsonwebtoken";
import { ParamsTypeTokenEncripted } from "../types/typesCommon";



export const encryptToken = async (params: ParamsTypeTokenEncripted) => {
  const prCryptoAlgorithm = process.env.ENV_ALGORITHM;
  const prCryptoSecretKey = process.env.ENV_SECRET_KEY;

  const iv = crypto.randomBytes(16);

  if (!prCryptoAlgorithm || !prCryptoSecretKey) {
    throw new Error("Estão faltando informações para a geração do token");
  }

  const encrypt = (text1: any) => {
    const cipher = crypto.createCipheriv(
      prCryptoAlgorithm,
      prCryptoSecretKey,
      iv
    );

    const encrypted = Buffer.concat([cipher.update(text1), cipher.final()]);

    return {
      iv: iv.toString("hex"),
      content: encrypted.toString("hex"),
    };
  };

  if (!params) throw new Error("Parâmetro vazio");
  if (!params.userId) {
    throw new Error("Uma das propriedades está vazia");
  }

  const typeEncr = encrypt(JSON.stringify(params));

  console.info("process.env.ENV_TOKEN_EXPIRATION =>", process.env.ENV_TOKEN_EXPIRATION)

  return jwt.sign(typeEncr, prCryptoSecretKey, {
    expiresIn: parseInt(process.env.ENV_TOKEN_EXPIRATION || '300') // tempo em segundos
  }); // gera o JWT token
};

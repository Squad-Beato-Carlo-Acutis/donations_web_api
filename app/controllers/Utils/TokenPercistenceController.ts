import { decryptToken } from "../../helpers/decryptToken";
import { encryptToken } from "../../helpers/encrytToken";

// TokenPercistenceController
export const TokenPercistenceController = {
  refreshToken: async (req: any, res: any) => {
    try {
      const token = req.headers["x-access-token"];
      const { userId, typeUser } = await decryptToken(token);

      const newToken = await encryptToken({
        userId: userId ?? 0,
        typeUser: typeUser ?? "DEFAULT",
      });

      res.status(200).json({
        auth: true,
        token: newToken,
        responseInfo: {
          statusCode: 200,
          msg: "Token atualizado com sucesso!",
        },
      });
    } catch (error: any) {
      console.error(error);
      res.status(401).json({
        errorMessage: "Erro ao tentar atualizar o token",
        error: error.message ? error.message : error,
        statusCode: 401,
      });
    }
  },
};

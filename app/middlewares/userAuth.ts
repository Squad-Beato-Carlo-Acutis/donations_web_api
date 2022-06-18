import { decryptToken } from "../helpers/decryptToken";

export const userAuth = async (req: any, res: any, next: () => any) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(401).json({
        auth: false,
        responseInfo: {
          statusCode: 401,
          msg: "Nenhum token fornecido.",
        },
      });
    }

    const { userId, typeUser } = await decryptToken(token);

    if (!req?.params?.userId) {
      req.params.userId = userId;
    }

    req.cdTypeUser = typeUser;

    req.userId = userId;
    if (next) next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      auth: false,
      responseInfo: {
        statusCode: 401,
        msg: "Falha ao autenticar o token.",
      },
    });
  }
};

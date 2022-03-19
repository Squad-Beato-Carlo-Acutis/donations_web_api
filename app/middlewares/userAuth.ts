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

  const { userId } = await decryptToken(token)

  req.userId = userId
  if(next) next()

  } catch(error){
    return res.status(500).json({
      auth: false,
      responseInfo: {
        statusCode: 500,
        msg: "Falha ao autenticar o token.",
      },
    });
  } 
};

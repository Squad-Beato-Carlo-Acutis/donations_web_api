import * as yup from "yup";
import { pt } from "yup-locale-pt";
import {
  checkPermission,
  PM_CREATE_USER,
  PM_DELETE_USER,
  PM_LIST_ALL_USER,
  PM_UPDATE_USER,
} from "../../config/permissions";
import { encryptToken } from "../../helpers/encrytToken";
import { TypeTabUsers } from "../../models/TabUsers";
import { UserTableRepository } from "../../repository/UserTableRepository";

// UserTableController
export const UserTableController = {
  fieldValidation: async (
    user: TypeTabUsers,
    typeValidation: "create" | "update" = "create"
  ): Promise<boolean> => {
    yup.setLocale(pt);
    let schema =
      typeValidation === "create"
        ? yup.object().shape({
            email: yup.string().email().required(),
            pws: yup.string().min(8).required(),
            username: yup.string().required(),
            nickname: yup.string().required(),
            ind_active: yup.boolean().notRequired(),
            type_user: yup.string().notRequired(),
          })
        : yup.object().shape({
            email: yup.string().email().notRequired(),
            pws: yup.string().min(8).notRequired(),
            username: yup.string().notRequired(),
            nickname: yup.string().notRequired(),
            ind_active: yup.boolean().notRequired(),
            type_user: yup.string().notRequired(),
          });

    let result: any;

    try {
      result = await schema.validate(user);
    } catch (error) {
      result = error;
    }

    // Validação de campos do formulário
    if (result.name === "ValidationError") {
      throw result.message;
    }

    return true;
  },

  getAll: async (req: any, res: any) => {
    try {
      if (!checkPermission(req.cdTypeUser, PM_LIST_ALL_USER)) {
        return res.status(403).json({
          errorMessage: "Este usuário não tem permissão para acessar essa rota",
          statusCode: 403,
        });
      }

      const userRepository = new UserTableRepository();
      res.status(200).json(
        await userRepository.searchAll({
          limit: req?.query?.limit,
          page: req?.query?.page,
        })
      );
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro ao tentar buscar todos os usuários",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  create: async (req: any, res: any) => {
    try {
      if (!checkPermission(req.cdTypeUser, PM_CREATE_USER)) {
        return res.status(403).json({
          errorMessage: "Este usuário não tem permissão para acessar essa rota",
          statusCode: 403,
        });
      }

      const userRepository = new UserTableRepository();
      const userData = req.body;
      await UserTableController.fieldValidation(userData, "create");
      const user = (await userRepository.create(userData)).toJSON();

      res.status(200).json({
        id: user.id,
        email: user.email,
        username: user.username,
        nickname: user.nickname,
        responseInfo: {
          statusCode: 200,
          msg: "Usuário cadastrado com sucesso",
        },
      });
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro na criação do usuário.",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  update: async (req: any, res: any) => {
    try {
      const { userId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");

      if (
        !checkPermission(req.cdTypeUser, PM_UPDATE_USER) &&
        userId !== req.userId // Caso passe o ID do user por parametro ele verifica se é o mesmo do token
      ) {
        return res.status(403).json({
          errorMessage: "Este usuário não tem permissão para acessar essa rota",
          statusCode: 403,
        });
      }

      const userData = req.body;
      await UserTableController.fieldValidation(userData, "update");
      const userRepository = new UserTableRepository();
      const user = (await userRepository.update(userId, userData)).toJSON();

      res.status(200).json({
        id: user.id,
        email: user.email,
        username: user.username,
        nickname: user.nickname,
        responseInfo: {
          statusCode: 200,
          msg: "Usuário atualizado com sucesso",
        },
      });
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro na atualização do usuário.",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  getById: async (req: any, res: any) => {
    try {
      const { userId } = req.params;

      if (!userId) throw new Error("ID do usuário não informado");

      const userRepository = new UserTableRepository();
      const user = (await userRepository.searchById(userId)).toJSON();
      res.status(200).json({
        id: user.id,
        email: user.email,
        username: user.username,
        nickname: user.nickname,
        responseInfo: {
          statusCode: 200,
          msg: "Usuário encontrado com sucesso",
        },
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({
        errorMessage: "Erro ao procurar usuário pelo ID",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  delete: async (req: any, res: any) => {
    try {
      if (!checkPermission(req.cdTypeUser, PM_DELETE_USER)) {
        return res.status(403).json({
          errorMessage: "Este usuário não tem permissão para acessar essa rota",
          statusCode: 403,
        });
      }

      const { userId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      const userRepository = new UserTableRepository();
      await userRepository.delete(userId);
      res.status(204).json();
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro ao tentar deletar o usuário",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  login: async (req: any, res: any) => {
    try {
      const { email, pws } = req.body;

      if (!email || !pws)
        throw new Error("os campos email e pws são obrigátórios");

      const userRepository = new UserTableRepository();
      const { userFound, userId, userName, typeUser, nickname } =
        await userRepository.login(email, pws);

      if (userFound) {
        const token = await encryptToken({
          userId: userId ?? 0,
          typeUser: typeUser ?? "DEFAULT",
        });

        res.status(200).json({
          auth: userFound,
          token,
          responseInfo: {
            statusCode: 200,
            msg: "Login realizado com sucesso",
          },
          userData: {
            userId,
            userName,
            nickname,
            typeUser,
          },
        });
      } else {
        res.status(200).json({
          auth: userFound,
          responseInfo: {
            statusCode: 200,
            msg: "Usuário não encontrado",
          },
        });
      }
    } catch (error: any) {
      console.error(error);
      res.status(400).json({
        errorMessage: "Erro ao tentar se conectar",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },
};

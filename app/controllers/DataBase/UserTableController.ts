import * as yup from "yup";
import { TypeTabUsers } from "../../models/TabUsers";
import { UserTableRepository } from "../../repository/UserTableRepository";

// UserTableController
export const UserTableController = {
  fieldValidation: async (
    user: TypeTabUsers,
    typeValidation: "create" | "update" = "create"
  ): Promise<boolean> => {
    let schema =
      typeValidation === "create"
        ? yup.object().shape({
            email: yup.string().email().required(),
            pws: yup.string().min(8).required(),
            username: yup.string().required(),
            ind_active: yup.boolean().notRequired(),
          })
        : yup.object().shape({
            email: yup.string().email().notRequired(),
            pws: yup.string().min(8).notRequired(),
            username: yup.string().notRequired(),
            ind_active: yup.boolean().notRequired(),
          });

    let result: any;

    try {
      result = await schema.validate(user);
    } catch (error) {
      result = error;
    }

    // Validação de campos do formulário
    if (result.name === "ValidationError") {
      throw new Error(result.message);
    }

    return true;
  },
  getAll: async (req: any, res: any) => {
    const userRepository = new UserTableRepository();
    res.json(await userRepository.searchAll())
  },

  create: async (req: any, res: any) => {
    try {
      const userRepository = new UserTableRepository();
      const userData = req.body;
      await UserTableController.fieldValidation(userData, "create");
      const user:any = await userRepository.create(userData)
      const dadosUser = user.toJSON()

      res.json({
        id: dadosUser.id,
        email: dadosUser.email, 
        responseInfo: {
          statusCode: 200, 
          msg: "Usuário cadastrado com sucesso"
        }
      })
    } catch (error) {}
  },

  update: async (req: any, res: any) => {
    const { userId } = req.params;
    const user = req.body;
    await UserTableController.fieldValidation(user, "update");
    const userRepository = new UserTableRepository();
    res.json(await userRepository.update(userId, user));
  },

  getById: async (req: any, res: any) => {
    const { userId } = req.params;

    if (!userId) throw new Error("ID do usuário não informado");

    const userRepository = new UserTableRepository();
    res.json(await userRepository.searchById(userId));
  },

  delete: async (req: any, res: any) => {
    const { userId } = req.params;
    const userRepository = new UserTableRepository();
    await userRepository.delete(userId);
    res.status(204).json();
  },
};

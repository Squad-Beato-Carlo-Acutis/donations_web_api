import * as yup from "yup";
import { encryptSha512 } from "../helpers/encryptSha512";
import { TabUsers, TypeTabUsers } from "../models/TabUsers";

export class UserTableRepository {
  async fieldValidation(
    user: TypeTabUsers,
    typeValidation: "create" | "update" = "create"
  ): Promise<boolean> {
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
  }

  async searchById(userId: number): Promise<TabUsers | {}> {
    if (!userId) throw new Error("ID do usuário não informado");
    const user = await TabUsers.findByPk(userId);
    return user ? user.toJSON() : {};
  }

  async searchAll(): Promise<Array<TabUsers>> {
    return await TabUsers.findAll();
  }

  async create(user: TypeTabUsers): Promise<TabUsers> {
    await this.fieldValidation(user);
    const encryptedPassword = encryptSha512(user.pws);

    const userRegister = await TabUsers.create({
      email: user.email,
      pws: encryptedPassword,
      username: user.username,
      ind_active: true,
    });

    return userRegister;
  }

  async update(userId: number, data: TypeTabUsers): Promise<TabUsers> {
    await this.fieldValidation(data, "update");
    if (!userId) throw new Error("ID do usuário não informado");

    const user = await TabUsers.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");

    await user.update(data);

    return user;
  }

  async delete(userId: number): Promise<boolean> {
    if (!userId) throw new Error("ID do usuário não informado");

    const user = await TabUsers.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");
    
    user.destroy();

    return true;
  }
}

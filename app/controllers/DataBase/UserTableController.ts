import * as yup from "yup";
import { string } from "yup/lib/locale";
import { encryptSha512 } from "../../helpers/encryptSha512";
import { TabUsers, TypeTabUsers } from "../../models/TabUsers";
import { InterfaceDatabaseController } from "./InterfaceDatabaseController";

export class UserTableController implements InterfaceDatabaseController {
  async fieldValidation(user: TypeTabUsers): Promise<boolean> {
    let schema = yup.object().shape({
      email: yup.string().required(),
      pws: yup.string().required(),
      username: yup.string().required(),
      ind_active: yup.boolean().notRequired(),
    });

    return await schema.isValid(user);
  }

  async searchById(params?: Record<string, any>): Promise<Record<any, any>> {
    const { user_id }: any = params;
    if (!user_id) throw new Error("Paramêtros ´user_id´ está vazio");
    let response = {};

    const user = await TabUsers.findByPk(user_id);
    response = user ? user.toJSON() : {};
    return response;
  }
  async search(params?: Record<string, any>): Promise<Record<string, any>> {
    return {};
  }
  async searchAll(): Promise<Record<string, any>> {
    return await TabUsers.findAll();
  }

  async create(params: Record<string, any>): Promise<Record<string, any>> {
    const { email, pws, username, ind_active } = params;
    this.fieldValidation({
      email,
      username,
      pws,
      ind_active,
    });
    const encryptedPassword = encryptSha512(pws);

    const user = await TabUsers.create({
      email,
      pws: encryptedPassword,
      username,
      ind_active: true,
    });

    return user;
  }

  async update(params: Record<string, any>): Promise<Record<string, any>> {
    throw new Error("Method not implemented.");
  }

  async delete(id: number): Promise<Record<string, any>> {
    throw new Error("Method not implemented.");
  }
}

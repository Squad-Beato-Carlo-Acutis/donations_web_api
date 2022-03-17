
import { encryptSha512 } from "../helpers/encryptSha512";
import { TabUsers, TypeTabUsers } from "../models/TabUsers";

export class UserTableRepository {
  

  async searchById(userId: number): Promise<TabUsers | {}> {
    const user = await TabUsers.findByPk(userId);
    return user ? user.toJSON() : {};
  }

  async searchAll(): Promise<Array<TabUsers>> {
    return await TabUsers.findAll();
  }

  async create(user: TypeTabUsers): Promise<TabUsers> {
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

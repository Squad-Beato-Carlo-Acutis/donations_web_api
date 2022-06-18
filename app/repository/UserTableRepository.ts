import { encryptSha512 } from "../helpers/encryptSha512";
import { TabUsers, TypeTabUsers } from "../models/TabUsers";

export class UserTableRepository {
  async searchById(userId: number): Promise<TabUsers> {
    const user = await TabUsers.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) throw new Error("Usuário não encontrado");
    return user;
  }

  async searchAll(): Promise<Array<TabUsers>> {
    return TabUsers.findAll({
      attributes: ["id", "email", "username"],
    });
  }

  async create(user: TypeTabUsers): Promise<TabUsers> {
    const encryptedPassword = encryptSha512(user.pws);

    const userCreate: TypeTabUsers = {
      email: user.email,
      pws: encryptedPassword,
      username: user.username,
      ind_active: true,
    };

    if (user?.type_user) {
      userCreate.type_user = user.type_user;
    }

    return TabUsers.create(userCreate);
  }

  async update(userId: number, data: TypeTabUsers): Promise<TabUsers> {
    const user = await TabUsers.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");

    await user.update(data);

    return user;
  }

  async delete(userId: number): Promise<boolean> {
    const user = await TabUsers.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");

    user.destroy();

    return true;
  }

  async login(
    email: string,
    pws: string
  ): Promise<{
    userFound: boolean;
    userId?: number;
    userName?: string;
    typeUser?: string;
  }> {
    const encryptedPassword = encryptSha512(pws);

    const user = await TabUsers.findOne({
      where: {
        email,
        pws: encryptedPassword,
      },
    });

    if (!user)
      return {
        userFound: false,
      };

    const userData = user.toJSON();

    return {
      userFound: true,
      userId: userData.id,
      userName: userData.username,
      typeUser: userData.type_user,
    };
  }
}

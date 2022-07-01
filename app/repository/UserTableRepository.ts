import { encryptSha512 } from "../helpers/encryptSha512";
import { TabUsers, TypeTabUsers } from "../models/TabUsers";
import { PaginationType } from "../types/PaginationType";

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

  async searchAll(pagination?: PaginationType): Promise<{
    data: Array<TabUsers>;
    totalPages: number;
  }> {
    const offset = pagination?.page
      ? parseInt(pagination?.page, 10) - 1
      : undefined;
    const limit = pagination?.limit
      ? parseInt(pagination?.limit, 10)
      : undefined;

    const page = offset && offset !== -1 && limit ? offset * limit : 0;

    const users = await TabUsers.findAndCountAll({
      limit,
      offset: page,
      attributes: ["id", "email", "username"],
    });

    return {
      data: users.rows,
      totalPages: parseInt((limit ? users.count / limit : 1).toFixed(0)),
    };
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

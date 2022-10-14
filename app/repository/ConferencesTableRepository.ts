import { TabConfereces, TypeTabConfereces } from "../models/TabConfereces";
import { TabUsers } from "../models/TabUsers";
import { PaginationType } from "../types/PaginationType";

export class ConferencesTableRepository {
  async searchById(
    userId: number,
    conferenceId: number
  ): Promise<TabConfereces> {
    const conference = await TabConfereces.findOne({
      where: {
        id: conferenceId,
        tb_user_id: userId,
      },
    });
    if (!conference) throw new Error("Conferencia não encontrada");
    return conference;
  }

  async searchAll(
    userId?: number,
    pagination?: PaginationType
  ): Promise<{
    data: Array<TabConfereces>;
    totalPages: number;
  }> {
    const offset = pagination?.page
      ? parseInt(pagination?.page, 10) - 1
      : undefined;
    const limit = pagination?.limit
      ? parseInt(pagination?.limit, 10)
      : undefined;

    const page = offset && offset !== -1 && limit ? offset * limit : 0;

    const conferences = await TabConfereces.findAndCountAll({
      limit,
      offset: page,
      where: userId
        ? {
            tb_user_id: userId,
          }
        : undefined,
      include: [
        {association: "users", attributes: [["nickname", "nickname"]],}
      ]
    });

    return {
      data: conferences.rows,
      totalPages: parseInt((limit ? conferences.count / limit : 1).toFixed(0)),
    };
  }

  async create(
    userId: number,
    conference: TypeTabConfereces
  ): Promise<TabConfereces> {
    const user = await TabUsers.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");

    return TabConfereces.create({
      tb_user_id: userId,
      description: conference.description,
      link_avatar: conference.link_avatar,
      about: conference.about,
      title_address: conference.title_address,
      address: conference.address,
      opening_hours: conference.opening_hours,
      map_iframe: conference.map_iframe,
      ind_active: conference.ind_active,
    });
  }

  async update(
    userId: number,
    conferenceId: number,
    data: TypeTabConfereces
  ): Promise<TabConfereces> {
    const user = await TabUsers.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");

    const conference = await TabConfereces.findByPk(conferenceId);
    if (!conference) throw new Error("Conferencia não encontrada");
    
    await conference.update(data);

    return conference;
  }

  async delete(userId: number, conferenceId: number): Promise<boolean> {
    const conference = await TabConfereces.findOne({
      where: {
        id: conferenceId,
        tb_user_id: userId,
      },
    });
    if (!conference) throw new Error("Conferencia não encontrada");

    conference.destroy();

    return true;
  }
}

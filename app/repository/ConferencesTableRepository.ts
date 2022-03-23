import { TabConfereces, TypeTabConfereces } from "../models/TabConfereces";
import { TabUsers } from "../models/TabUsers";

export class ConferencesTableRepository {
  async searchById(
    userId: number,
    conferenceId: number
  ): Promise<TabConfereces> {
    const conference = await TabConfereces.findOne({
      where: {
        id: conferenceId,
        tb_users_id: userId,
      }
    });
    if (!conference) throw new Error("Conferencia não encontrada");
    return conference;
  }

  async searchAll(userId: number): Promise<Array<TabConfereces>> {
    return await TabConfereces.findAll({
      where: {
        tb_users_id: userId,
      },
    });
  }

  async create(
    userId: number,
    conference: TypeTabConfereces
  ): Promise<TabConfereces> {
    const user = await TabUsers.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");

    const conferenceRegister = await TabConfereces.create({
      tb_users_id: userId,
      description: conference.description,
      link_avatar: conference.link_avatar,
      about: conference.about,
      title_address: conference.title_address,
      address: conference.address,
      opening_hours: conference.opening_hours,
      ind_active: conference.ind_active,
    });

    return conferenceRegister;
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
        tb_users_id: userId
      }
    });
    if (!conference) throw new Error("Conferencia não encontrada");

    conference.destroy();

    return true;
  }
}

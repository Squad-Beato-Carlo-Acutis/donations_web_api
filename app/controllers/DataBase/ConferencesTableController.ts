import * as yup from "yup";
import { pt } from "yup-locale-pt";
import { TypeTabConfereces } from "../../models/TabConfereces";
import { ConferencesTableRepository } from "../../repository/ConferencesTableRepository";

// UserTableController
export const ConferencesTableController = {
  fieldValidation: async (
    user: TypeTabConfereces,
    typeValidation: "create" | "update" = "create"
  ): Promise<boolean> => {
    yup.setLocale(pt);
    let schema =
      typeValidation === "create"
        ? yup.object().shape({
            description: yup.string().required(),
            link_avatar: yup.string().notRequired(),
            about: yup.string().required(),
            title_address: yup.string().required(),
            address: yup.string().required(),
            opening_hours: yup.string().required(),
            ind_active: yup.boolean().notRequired(),
          })
        : yup.object().shape({
            description: yup.string().notRequired(),
            link_avatar: yup.string().notRequired(),
            about: yup.string().notRequired(),
            title_address: yup.string().notRequired(),
            address: yup.string().notRequired(),
            opening_hours: yup.string().notRequired(),
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
      throw result.message;
    }

    return true;
  },

  getAll: async (req: any, res: any) => {
    try {
      const { userId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      const conferenceRepository = new ConferencesTableRepository();
      res.status(200).json(await conferenceRepository.searchAll(userId));
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro ao tentar buscar todas as conferencias",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  create: async (req: any, res: any) => {
    try {
      const { userId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      const conferenceRepository = new ConferencesTableRepository();
      const conferenceData = req.body;
      await ConferencesTableController.fieldValidation(
        conferenceData,
        "create"
      );
      const conference = (
        await conferenceRepository.create(userId, conferenceData)
      ).toJSON();

      res.status(200).json({
        ...conference,
        responseInfo: {
          statusCode: 200,
          msg: "Conferencia cadastrada com sucesso",
        },
      });
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro na criação da conferencia.",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  update: async (req: any, res: any) => {
    try {
      const { userId, conferenceId } = req.params;

      if (!userId) throw new Error("ID do usuário não informado");
      if (!conferenceId) throw new Error("ID da conferencia não informado");

      const conferenceData = req.body;
      await ConferencesTableController.fieldValidation(
        conferenceData,
        "update"
      );
      const conferenceRepository = new ConferencesTableRepository();
      const conference = (
        await conferenceRepository.update(userId, conferenceId, conferenceData)
      ).toJSON();

      res.status(200).json({
        ...conference,
        responseInfo: {
          statusCode: 200,
          msg: "Conferencia atualizada com sucesso",
        },
      });
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro na atualização da conferencia.",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  getById: async (req: any, res: any) => {
    try {
      const { userId, conferenceId} = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      if (!conferenceId) throw new Error("ID da conferencia não informado");

      const conferenceRepository = new ConferencesTableRepository();
      const conference = (await conferenceRepository.searchById(userId, conferenceId)).toJSON();
      res.status(200).json({
        ...conference,
        responseInfo: {
          statusCode: 200,
          msg: "Conferencia encontrada com sucesso",
        },
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({
        errorMessage: "Erro ao procurar conferencia pelo ID",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  delete: async (req: any, res: any) => {
    try {
      const { userId, conferenceId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      if (!conferenceId) throw new Error("ID da conferencia não informado");
      const conferenceRepository = new ConferencesTableRepository();
      await conferenceRepository.delete(userId, conferenceId);
      res.status(204).json();
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro ao tentar deletar a conferencia",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },
};

import * as yup from "yup";
import { pt } from "yup-locale-pt";
import { TypeTabMeasures } from "../../models/TabMeasures";
import { MeasureTableRepository } from "../../repository/MeasureTableRepository";

// MeasureTableController
export const MeasureTableController = {
  fieldValidation: async (
    measure: TypeTabMeasures,
    typeValidation: "create" | "update" = "create"
  ): Promise<boolean> => {
    yup.setLocale(pt);
    let schema =
      typeValidation === "create"
        ? yup.object().shape({
            description: yup.string().required(),
            abbreviation: yup.string().required(),
          })
        : yup.object().shape({
            description: yup.string().notRequired(),
            abbreviation: yup.string().notRequired(),
          });

    let result: any;

    try {
      result = await schema.validate(measure);
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
      const measureRepository = new MeasureTableRepository();
      res.status(200).json(
        await measureRepository.searchAll({
          limit: req?.query?.limit,
          page: req?.query?.page,
        })
      );
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro ao tentar buscar todos os medidas",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  create: async (req: any, res: any) => {
    try {
      const { userId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");

      const measureRepository = new MeasureTableRepository();
      const measureData = req.body;
      await MeasureTableController.fieldValidation(measureData, "create");
      const measure = (await measureRepository.create(userId, measureData)).toJSON();

      res.status(200).json({
        id: measure.id,
        description: measure.description,
        abbreviation: measure.abbreviation,
        responseInfo: {
          statusCode: 200,
          msg: "Medida cadastrada com sucesso",
        },
      });
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro na criação da medida.",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  update: async (req: any, res: any) => {
    try {
      const { userId, measureId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      if (!measureId) throw new Error("ID da medida não informado");

      const measureData = req.body;
      await MeasureTableController.fieldValidation(measureData, "update");
      const measureRepository = new MeasureTableRepository();
      const measure = (await measureRepository.update(userId, measureId, measureData)).toJSON();

      res.status(200).json({
        id: measure.id,
        description: measure.description,
        abbreviation: measure.abbreviation,
        responseInfo: {
          statusCode: 200,
          msg: "Medida atualizada com sucesso",
        },
      });
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro na atualização da medida.",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  delete: async (req: any, res: any) => {
    try {

      const { userId, measureId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      if (!measureId) throw new Error("ID da medida não informado");
      
      const measureRepository = new MeasureTableRepository();
      await measureRepository.delete(userId, measureId);
      res.status(204).json();
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro ao tentar deletar a medida",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },
};

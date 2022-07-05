import * as yup from "yup";
import { pt } from "yup-locale-pt";
import { TypeTabCategories } from "../../models/TabCategories";
import { CategoryTableRepository } from "../../repository/CategoryTableRepository";

// CategoryTableController
export const CategoryTableController = {
  fieldValidation: async (
    category: TypeTabCategories,
    typeValidation: "create" | "update" = "create"
  ): Promise<boolean> => {
    yup.setLocale(pt);
    let schema =
      typeValidation === "create"
        ? yup.object().shape({
            description: yup.string().required(),
            posit_level: yup.number().required(),
          })
        : yup.object().shape({
            description: yup.string().notRequired(),
            posit_level: yup.number().notRequired(),
          });

    let result: any;

    try {
      result = await schema.validate(category);
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
      const categoryRepository = new CategoryTableRepository();
      res.status(200).json(
        await categoryRepository.searchAll({
          limit: req?.query?.limit,
          page: req?.query?.page,
        })
      );
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro ao tentar buscar todos os categorias",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  create: async (req: any, res: any) => {
    try {
      const { userId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");

      const categoryRepository = new CategoryTableRepository();
      const categoryData = req.body;
      await CategoryTableController.fieldValidation(categoryData, "create");
      const category = (await categoryRepository.create(userId, categoryData)).toJSON();

      res.status(200).json({
        id: category.id,
        description: category.description,
        posit_level: category.posit_level,
        responseInfo: {
          statusCode: 200,
          msg: "Categoria cadastrada com sucesso",
        },
      });
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro na criação da categoria.",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  update: async (req: any, res: any) => {
    try {
      const { userId, categoryId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      if (!categoryId) throw new Error("ID da categoria não informado");

      const categoryData = req.body;
      await CategoryTableController.fieldValidation(categoryData, "update");
      const categoryRepository = new CategoryTableRepository();
      const category = (await categoryRepository.update(userId, categoryId, categoryData)).toJSON();

      res.status(200).json({
        id: category.id,
        description: category.description,
        posit_level: category.posit_level,
        responseInfo: {
          statusCode: 200,
          msg: "Categoria atualizada com sucesso",
        },
      });
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro na atualização da categoria.",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  delete: async (req: any, res: any) => {
    try {

      const { userId, categoryId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      if (!categoryId) throw new Error("ID da categoria não informado");
      
      const categoryRepository = new CategoryTableRepository();
      await categoryRepository.delete(userId, categoryId);
      res.status(204).json();
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro ao tentar deletar a categoria",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },
};

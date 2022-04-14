import * as yup from "yup";
import { pt } from "yup-locale-pt";
import { TypeTabBasicBasket } from "../../models/TabBasicBasket";
import { BasicBasketTableRepository } from "../../repository/BasicBasketTableRepository";

// UserTableController
export const BasicBasketTableController = {
  checkValidFieldsBasicBasket: async (
    basicBasket: TypeTabBasicBasket,
    typeValidation: "create" | "update" = "create"
  ): Promise<boolean> => {
    yup.setLocale(pt);
    let schema =
      typeValidation === "create"
        ? yup.object().shape({
            description: yup.string().required(),
            ind_active: yup.boolean().notRequired(),
          })
        : yup.object().shape({
            description: yup.string().notRequired(),
            ind_active: yup.boolean().notRequired(),
          });

    let result: any;

    try {
      result = await schema.validate(basicBasket);
    } catch (error) {
      result = error;
    }

    // Validação de campos do formulário
    if (result.name === "ValidationError") {
      throw result.message;
    }

    return true;
  },

  checkValidFieldsProductBasicBasket: async (
    basicBasket: TypeTabBasicBasket
  ): Promise<boolean> => {
    yup.setLocale(pt);
    let schema = yup.object().shape({
      productId: yup.number().required(),
      quantity: yup.number().required(),
      priority: yup.number().required(),
      ind_essential: yup.boolean().required(),
      ind_active: yup.boolean().notRequired(),
    });

    let result: any;

    try {
      result = await schema.validate(basicBasket);
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
      const basicBasketRepository = new BasicBasketTableRepository();
      res.status(200).json(await basicBasketRepository.searchAll(userId));
    } catch (error: any) {
      console.error(error)
      res.status(400).json({
        errorMessage: "Erro ao tentar buscar todas as cestas basicas",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  create: async (req: any, res: any) => {
    try {
      const { userId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      const basicBasketRepository = new BasicBasketTableRepository();
      const basicBasketData = req.body;
      await BasicBasketTableController.checkValidFieldsBasicBasket(
        basicBasketData,
        "create"
      );
      const basicBasket = (
        await basicBasketRepository.create(userId, basicBasketData)
      ).toJSON();

      res.status(200).json({
        ...basicBasket,
        responseInfo: {
          statusCode: 200,
          msg: "Cesta básica cadastrada com sucesso",
        },
      });
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro na criação da cesta básica.",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  update: async (req: any, res: any) => {
    try {
      const { userId, basicBasketId } = req.params;

      if (!userId) throw new Error("ID do usuário não informado");
      if (!basicBasketId) throw new Error("ID da cesta básica não informada");

      const basicBasketData = req.body;
      await BasicBasketTableController.checkValidFieldsBasicBasket(
        basicBasketData,
        "update"
      );
      const basicBasketRepository = new BasicBasketTableRepository();
      const basicBasket = (
        await basicBasketRepository.update(
          userId,
          basicBasketId,
          basicBasketData
        )
      ).toJSON();

      res.status(200).json({
        ...basicBasket,
        responseInfo: {
          statusCode: 200,
          msg: "Cesta básica atualizada com sucesso",
        },
      });
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro na atualização da cesta básica.",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  getById: async (req: any, res: any) => {
    try {
      const { userId, basicBasketId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      if (!basicBasketId) throw new Error("ID da cesta básica não informada");

      const basicBasketRepository = new BasicBasketTableRepository();
      const basicBasket = (
        await basicBasketRepository.searchById(userId, basicBasketId)
      ).toJSON();
      res.status(200).json({
        ...basicBasket,
        responseInfo: {
          statusCode: 200,
          msg: "Cesta básica encontrada com sucesso",
        },
      });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({
        errorMessage: "Erro ao buscar a cesta básica pelo ID",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  delete: async (req: any, res: any) => {
    try {
      const { userId, basicBasketId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      if (!basicBasketId) throw new Error("ID da cesta básica não informada");
      const basicBasketRepository = new BasicBasketTableRepository();
      await basicBasketRepository.delete(userId, basicBasketId);
      res.status(204).json();
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro ao tentar deletar a cesta básica",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  insertProduct: async (req: any, res: any) => {
    try {
      const { basicBasketId, userId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      if (!basicBasketId) throw new Error("ID da Cesta básica não informada");
      const productBasicBasketRepository = new BasicBasketTableRepository();
      const productBasicBasketData = req.body;
      await BasicBasketTableController.checkValidFieldsProductBasicBasket(
        productBasicBasketData
      );
      const productBasicBasket = (
        await productBasicBasketRepository.insertProduct(
          userId,
          basicBasketId,
          productBasicBasketData
        )
      ).toJSON();

      res.status(200).json({
        ...productBasicBasket,
        responseInfo: {
          statusCode: 200,
          msg: "Produto cadastrado com sucesso na cesta básica",
        },
      });
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro no cadastro do produto na cesta básica.",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  deleteProduct: async (req: any, res: any) => {
    try {
      const { basicBasketId, productId, userId } = req.params;

      if (!userId) throw new Error("ID do usuário não informado");
      if (!basicBasketId) throw new Error("ID da cesta básica não informada");
      if (!productId) throw new Error("ID do produto não informado");

      const basicBasketRepository = new BasicBasketTableRepository();
      await basicBasketRepository.deleteProduct(
        userId,
        basicBasketId,
        productId
      );
      res.status(204).json();
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro ao tentar deletar do produto na cesta básica",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },
};

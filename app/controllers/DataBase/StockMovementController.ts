import * as yup from "yup";
import { pt } from "yup-locale-pt";
import { TypeTabStockMovement } from "../../models/TabStockMovement";
import { StockMovementRepository } from "../../repository/StockMovementRepository";

// UserTableController
export const StockMovementController = {
  checkValidFieldsProductStockMovement: async (
    stockMovement: TypeTabStockMovement
  ): Promise<boolean> => {
    yup.setLocale(pt);
    let schema = yup.object().shape({
      products: yup.number().required(),
      movementDescription: yup.number().required(),
    });

    let result: any;

    try {
      result = await schema.validate(stockMovement);
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
      const { userId, conferenceId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      if (!conferenceId) throw new Error("ID da conferencia não informada");

      const stockMovementRepository = new StockMovementRepository();
      res
        .status(200)
        .json(await stockMovementRepository.searchAll(userId, conferenceId));
    } catch (error: any) {
      console.error(error);
      res.status(400).json({
        errorMessage: "Erro ao tentar buscar todas as movimentações de estoque",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  getById: async (req: any, res: any) => {
    try {
      const { userId, conferenceId, stockMovementId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      if (!conferenceId) throw new Error("ID da conferencia não informada");
      if (!stockMovementId) throw new Error("ID do movimento não informado");

      const stockMovementRepository = new StockMovementRepository();
      const stockMovement = (
        await stockMovementRepository.searchById(
          userId,
          stockMovementId,
          conferenceId
        )
      ).toJSON();
      res.status(200).json({
        ...stockMovement,
        responseInfo: {
          statusCode: 200,
          msg: "Movimento de estoque encontrado com sucesso",
        },
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({
        errorMessage: "Erro ao buscar o movimento de estoque pelo ID",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  generateStockMovement: async (req: any, res: any) => {
    try {
      const { userId, conferenceId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      if (!conferenceId) throw new Error("ID da conferencia não informada");

      const { products, movementDescription } = req.body;

      const stockMovementRepository = new StockMovementRepository();
      await stockMovementRepository.generateStockMovement({
        userId,
        conferenceId,
        products: products,
        movementDescription,
      });
      res.status(204).json();
    } catch (error: any) {
      console.error(error);
      res.status(400).json({
        errorMessage: "Erro ao tentar buscar todas as cestas basicas",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  inactivateStockMovement: async (req: any, res: any) => {
    try {
      const { userId, conferenceId, stockMovementId} = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      if (!conferenceId) throw new Error("ID da conferencia não informada");
      if (!stockMovementId) throw new Error("ID do movimento não informado");

      const stockMovementRepository = new StockMovementRepository();
      await stockMovementRepository.inactivateStockMovement(userId, stockMovementId, conferenceId)

      res.status(204).json();
    } catch (error: any) {
      console.error(error);
      res.status(400).json({
        errorMessage: "Erro ao inativar o movimento de estoque pelo ID",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  getCurrentStock: async (req: any, res: any) => {
    try {
      const { userId, conferenceId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      if (!conferenceId) throw new Error("ID da conferencia não informada");

      const stockMovementRepository = new StockMovementRepository();
      res
        .status(200)
        .json(await stockMovementRepository.getCurrentStock(userId, conferenceId));
    } catch (error: any) {
      console.error(error);
      res.status(400).json({
        errorMessage: "Erro ao tentar buscar todas as movimentações de estoque",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  getNeededProductsStock: async (req: any, res: any) => {
    try {
      const { userId, conferenceId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      if (!conferenceId) throw new Error("Conferencia não informada");
      const stockMovementRepository = new StockMovementRepository();

      res
        .status(200)
        .json(
          await stockMovementRepository.getNeededProductsStock(userId, conferenceId)
        );
    } catch (error: any) {
      console.error(error);
      res.status(400).json({
        errorMessage: "Erro ao tentar buscar todos os produtos necessários",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },
};

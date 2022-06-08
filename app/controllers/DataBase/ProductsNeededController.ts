import * as yup from "yup";
import { pt } from "yup-locale-pt";
import { TypeProductsNeededRepository } from "../../models/TabProductsNeeded";
import { ProductsNeededRepository } from "../../repository/ProductsNeededRepository";

// UserTableController
export const ProductsNeededController = {
  checkValidFieldsproductNeeded: async (
    productNeeded: Array<TypeProductsNeededRepository>,
    type: "createOrUpdate" | "delete"
  ): Promise<boolean> => {
    yup.setLocale(pt);
    let schema =
      type === "createOrUpdate"
        ? yup.object().shape({
            productId: yup.number().required(),
            quantity: yup.number().required(),
          })
        : yup.object().shape({
            productId: yup.number().required(),
          });

    let result: any;

    try {
      if (!Array.isArray(productNeeded))
        throw new Error("Os produtos devem ser enviados dentro de um Array!");

      if (!productNeeded.length) throw new Error("Nenhum produto foi enviado!");

      productNeeded.forEach(async (product) => {
        result = await schema.validate(product);
      });
    } catch (error) {
      result = error;
    }

    // Validação de campos do formulário
    if (result?.name === "ValidationError") {
      throw result?.message;
    }

    return true;
  },

  getAll: async (req: any, res: any) => {
    try {
      const { userId, conferenceId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      if (!conferenceId) throw new Error("Conferencia não informada");
      const productsNeededRepository = new ProductsNeededRepository();

      const productsNeeded = await productsNeededRepository.searchAllProducts(
        userId,
        conferenceId
      );

      res.status(200).json(
        productsNeeded.map<TypeProductsNeededRepository>((product) => {
          return {
            productId: product.tb_product_id,
            productDescription: product.products.description,
            productMeasurement: product.products.measure.abbreviation,
            quantity: product.quantity,
          };
        })
      );
    } catch (error: any) {
      console.error(error);
      res.status(400).json({
        errorMessage: "Erro ao tentar buscar todas as cestas basicas",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  createOrUpdate: async (req: any, res: any) => {
    try {
      const { userId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      const { conferenceId } = req.params;
      if (!conferenceId) throw new Error("ID da conferencia não informada");

      const productNeededRepository = new ProductsNeededRepository();
      const productNeededData = req.body;
      await ProductsNeededController.checkValidFieldsproductNeeded(
        productNeededData,
        "createOrUpdate"
      );
      const productNeeded = await productNeededRepository.createOrUpdate(
        userId,
        conferenceId,
        productNeededData
      );

      res.status(200).json({
        updatedProducts: productNeeded,
        responseInfo: {
          statusCode: 200,
          msg: "Produtos cadastrados na conferencia com sucesso",
        },
      });
    } catch (error: any) {
      res.status(400).json({
        errorMessage:
          "Erro na inserção ou atualização dos produtos da conferencia",
        error: error.message ? error.message : error,
        statusCode: 400,
      });

      console.error(error);
    }
  },

  delete: async (req: any, res: any) => {
    try {
      const { userId, conferenceId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      if (!conferenceId) throw new Error("ID da conferencia não informada");

      const products = req.body;
      await ProductsNeededController.checkValidFieldsproductNeeded(
        products,
        "delete"
      );

      const productNeededRepository = new ProductsNeededRepository();
      await productNeededRepository.delete(userId, conferenceId, products);
      res.status(204).json();
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro ao tentar deletar os produtos",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },
};

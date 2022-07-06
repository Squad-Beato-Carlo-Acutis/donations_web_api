import * as yup from "yup";
import { pt } from "yup-locale-pt";
import { compressImage, deleteImage } from "../../helpers/helperImage";
import { TypeTabProducts } from "../../models/TabProducts";
import { ProductsTableRepository } from "../../repository/ProductsTableRepository";

// UserTableController
export const ProductsTableController = {
  fieldValidation: async (
    product: TypeTabProducts,
    typeValidation: "create" | "update" = "create"
  ): Promise<boolean> => {
    yup.setLocale(pt);
    let schema =
      typeValidation === "create"
        ? yup.object().shape({
            description: yup.string().required(),
            tb_measure_id: yup.number().min(1).required(),
            tb_category_id: yup.number().min(1).required(),
            ind_active: yup.boolean().notRequired(),
          })
        : yup.object().shape({
            description: yup.string().notRequired(),
            tb_measure_id: yup.number().min(1).notRequired(),
            tb_category_id: yup.number().min(1).notRequired(),
            ind_active: yup.boolean().notRequired(),
          });

    let result: any;

    try {
      result = await schema.validate(product);
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
      const productRepository = new ProductsTableRepository();
      res.status(200).json(await productRepository.searchAll(userId, {
        limit: req?.query?.limit,
        page: req?.query?.page,
      }));
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro ao tentar buscar todos os produtos",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  create: async (req: any, res: any) => {
    try {
      const { userId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      const productRepository = new ProductsTableRepository();
      const productData = req.body;
      await ProductsTableController.fieldValidation(productData, "create");
      const product = (
        await productRepository.create(userId, productData)
      ).toJSON();

      res.status(200).json({
        ...product,
        responseInfo: {
          statusCode: 200,
          msg: "Produto cadastrado com sucesso",
        },
      });
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro na criação do produto.",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  update: async (req: any, res: any) => {
    try {
      const { userId, productId } = req.params;

      if (!userId) throw new Error("ID do usuário não informado");
      if (!productId) throw new Error("ID do produto não informado");

      const productData = req.body;

      await ProductsTableController.fieldValidation(productData, "update");
      const productRepository = new ProductsTableRepository();

      const product = (
        await productRepository.update(userId, productId, productData)
      ).toJSON();

      res.status(200).json({
        ...product,
        responseInfo: {
          statusCode: 200,
          msg: "Produto atualizado com sucesso",
        },
      });
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro na atualização do produto.",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  getById: async (req: any, res: any) => {
    try {
      const { userId, productId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      if (!productId) throw new Error("ID do produto não informado");

      const productRepository = new ProductsTableRepository();
      const product = (
        await productRepository.searchById(userId, productId)
      ).toJSON();
      res.status(200).json({
        ...product,
        responseInfo: {
          statusCode: 200,
          msg: "Produto encontrado com sucesso",
        },
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({
        errorMessage: "Erro ao buscar o produto pelo ID",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  delete: async (req: any, res: any) => {
    try {
      const { userId, productId } = req.params;
      if (!userId) throw new Error("ID do usuário não informado");
      if (!productId) throw new Error("ID do produto não informado");
      const productRepository = new ProductsTableRepository();
      await productRepository.delete(userId, productId);
      res.status(204).json();
    } catch (error: any) {
      res.status(400).json({
        errorMessage: "Erro ao tentar deletar o produto",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },

  uploadImage: async (req: any, res: any) => {
    try {
      const { userId, productId } = req.params;

      if (!userId) throw new Error("ID do usuário não informado");
      if (!productId) throw new Error("ID do produto não informado");
      if (!req.file) throw new Error("Imagem do produto inválida");
      const pathImage = await compressImage(req.file);
      const productRepository = new ProductsTableRepository();
      const oldImg = (await productRepository.searchById(userId, productId)).toJSON()?.link_image;
      deleteImage(oldImg)

      const product = (
        await productRepository.update(userId, productId, {
          link_image: pathImage,
        } as any)
      ).toJSON();

      res.status(200).json({
        link_image: product.link_image,
        responseInfo: {
          statusCode: 200,
          msg: "Upload da imagem realizado com sucesso",
        },
      });
    } catch (error: any) {
      deleteImage(req?.file?.path);

      res.status(400).json({
        errorMessage: "Erro no upload da imagem do produto.",
        error: error.message ? error.message : error,
        statusCode: 400,
      });
    }
  },
};

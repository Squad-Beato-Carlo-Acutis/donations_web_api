import { UserTableRepository } from "../../repository/UserTableRepository";

// UserTableController
export const UserTableController = {
  getAll: async (req: any, res: any) => {
    const userController = new UserTableRepository();
    res.json(await userController.searchAll());
  },

  create: async (req: any, res: any) => {
    const userController = new UserTableRepository();
    res.json(await userController.create(req.body));
  },

  update: async (req: any, res: any) => {
    const { userId } = req.params
    const userController = new UserTableRepository();
    res.json(await userController.update(userId, req.body));
  },

  getById: async (req: any, res: any) => {
    const { userId } = req.params
    const userController = new UserTableRepository();
    res.json(await userController.searchById(userId));
  },

  delete: async (req: any, res: any) => {
    const { userId } = req.params
    const userController = new UserTableRepository();
    await userController.delete(userId)
    res.status(204).json();
  }
}
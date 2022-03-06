import { TabUsers } from "../../models/TabUsers";
import { InterfaceDatabaseController } from "./InterfaceDatabaseController";

export class UserTableController implements InterfaceDatabaseController{
  async search(params?: Record<string, any>): Promise<Record<string, any>> {
    return await TabUsers.findAll();
  }
  async searchAll(): Promise<Record<string, any>> {
    return await TabUsers.findAll();
  }
  async save(params: Record<string, any>): Promise<Record<string, any>> {
    throw new Error("Method not implemented.");
  }
  async update(params: Record<string, any>): Promise<Record<string, any>> {
    throw new Error("Method not implemented.");
  }
  async delete(id: number): Promise<Record<string, any>> {
    throw new Error("Method not implemented.");
  }

}

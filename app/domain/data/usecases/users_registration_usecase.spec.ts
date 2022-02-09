import { ControllerModelInterface } from "../../common/ControllerModelInterface";

//Substituir pelo framework de acesso ao mysql
//  - Implementar o sequelize e o mysql:
// - http://www.macoratti.net/17/01/node_sequelize1.html
const insert = async () => {
  return true;
}

type UserModel = {
  email: string
  pws: string
  name: string
}

class UserController implements ControllerModelInterface{
  save(model: Record<string, any>): Promise<boolean> {
    return insert();
  }
  get(index: string, value: string): Promise<Record<string, any>[]> {
    throw new Error("Method not implemented.");
  }
  delete(index: string, value: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}


describe('User Registration', () => {
  test('user is being created', async () => {
    const newUser: UserModel = {
      email: 'teste@jest',
      pws: 'test',
      name: 'Name Teste'
    }
    const userController = new UserController();
    const response = await userController.save(newUser)
    expect(response).toBe(true)
 })
})

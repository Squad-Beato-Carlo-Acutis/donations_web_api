import { Sequelize, Model, DataTypes } from "sequelize";
import express from 'express'

import { Router, Request, Response } from 'express';

const app = express();

const route = Router()

app.use(express.json())


class UserController {
  
  async conect () {
    const conection = new Sequelize('dbdonations', 'root', '', {
      host: 'localhost',
      dialect: 'mysql'
    })

    try {
      await conection.authenticate()
     console.info('Conexão estabelecida!')
   } catch(error) {
     console.error('Não foi possivel conectar ao banco', error)
   }

    const Users = conection.define('tb_usersss', {
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      pws: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name_user: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ind_active: {
        type: DataTypes.TINYINT,
        defaultValue: true
      }
    }, {
      freezeTableName: true
    });

    conection.sync().then( () => {
      Users.findAll().then((usuarios) => {
        console.log('usuarios => ', usuarios)
      })
    })
  }

  update(model: Record<string, any>): Promise<Record<string, any>> {
    throw new Error("Method not implemented.");
  }
  save(model: Record<string, any>): Promise<Record<string, any>> {
    throw new Error("Method not implemented.");
  }
  get(index: string, value: string): Promise<Record<string, any>[]> {
    throw new Error("Method not implemented.");
  }
  delete(index: string, value: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

route.get('/', (req: Request, res: Response) => {
  res.json({ message: 'hello world with Typescript' })
})

route.get('/users', async (req: Request, res: Response) => {

  const userController = new UserController();
  userController.conect()

  res.json({ message: 'hello world with Typescript' })
})

app.use(route)


app.listen(3333, () => 'server running on port 3333')
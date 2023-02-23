import { User, dataSource } from '@djalmahjr/lib-database-calendar';

import { Request, Response } from 'express';
import { messages } from '../i18n/pt';
import UserMapper from '../mappers/UserMapper';

export async function list(req: Request, res: Response) {
  try {
    const { email } = req.query;
    const user = await dataSource.getRepository(User).find({
      where: {
        ...(email ? { email: email as string } : {}),
      },
    });
    return res.status(200).json(UserMapper.map(user));
  } catch (error) {
    console.log(error);
    return res.status(500).send(messages.errorServer);
  }
}

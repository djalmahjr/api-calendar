import { dataSource, User } from '@djalmahjr/lib-database-calendar';
import { Request, Response } from 'express';
import { messages } from '../i18n/pt';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthMapper from '../mappers/AuthMapper';
import { jwtSecret } from '../config/AuthConfig';

async function create(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await dataSource.getRepository(User).findOne({
      where: {
        email,
      },
    });
    if (!user) return res.status(404).json({ error: messages.userNotFound });

    const check = await bcrypt.compare(password, user.password);
    if (!check)
      return res.status(400).json({ error: messages.passwordOrEmailIncorrect });

    const expiresIn = 3600;

    const token = jwt.sign({ guid: user.guid }, jwtSecret, {
      expiresIn,
    });

    return res.status(200).json(AuthMapper.objectMap({ token, expiresIn }));
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: JSON.stringify(error) });
  }
}

export default { create };

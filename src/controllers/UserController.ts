import { User, dataSource } from '@djalmahjr/lib-database-calendar';

import { Request, Response } from 'express';
import { messages } from '../i18n/pt';
import UserMapper from '../mappers/UserMapper';

import bcrypt from 'bcrypt';

async function list(req: Request, res: Response) {
  try {
    const { email, guid } = req.query;
    const user = await dataSource.getRepository(User).find({
      where: {
        ...(email ? { email: email as string } : {}),
        ...(guid ? { guid: guid as string } : {}),
      },
    });
    return res.status(200).json(UserMapper.map(user));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: messages.errorServer });
  }
}

async function create(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const existUser = await dataSource
      .getRepository(User)
      .findOne({ where: { email } });
    if (existUser)
      return res.status(400).json({ error: messages.userEmailFound });

    const hash = await bcrypt.hash(password, 10);
    const passwordHashed = hash;

    const user = await dataSource
      .getRepository(User)
      .create({ email, password: passwordHashed })
      .save({ reload: true });

    return res.status(200).json(UserMapper.map(user));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: messages.errorServer });
  }
}

async function edit(req: Request, res: Response) {
  try {
    const { guid } = req.params;
    const { email, password } = req.body;

    const user = await dataSource
      .getRepository(User)
      .findOne({ where: { guid: guid } });
    if (!user) return res.status(404).json({ error: messages.userNotFound });

    if (email && email !== user.email) {
      const existUser = await dataSource
        .getRepository(User)
        .findOne({ where: { email } });
      if (existUser)
        return res.status(400).json({ error: messages.userEmailFound });
    }

    user.email = email || user.email;
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      user.password = hash;
    }

    await user.save({ reload: true });

    return res.status(200).json(UserMapper.map(user));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: messages.errorServer });
  }
}

async function destroy(req: Request, res: Response) {
  try {
    const { guid } = req.params;

    const user = await dataSource
      .getRepository(User)
      .findOne({ where: { guid } });
    if (!user) return res.status(404).json({ error: messages.userNotFound });

    await user.softRemove({ reload: true });

    return res.status(200).json({
      guid,
      email: user.email,
      deletedAt: user.deletedAt,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: messages.errorServer });
  }
}

export default {
  list,
  create,
  edit,
  destroy,
};

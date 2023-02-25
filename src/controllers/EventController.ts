import { Event, dataSource, User } from '@djalmahjr/lib-database-calendar';

import { Request, Response } from 'express';
import { messages } from '../i18n/pt';
import EventMapper from '../mappers/EventMapper';
import { Like } from 'typeorm';

async function list(req: Request, res: Response) {
  try {
    const { title, guid, userGuid } = req.query;
    const existUser = await dataSource
      .getRepository(User)
      .findOne({ where: { guid: userGuid as string } });
    if (!existUser)
      return res.status(400).json({ error: messages.userNotFound });
    const event = await dataSource.getRepository(Event).find({
      where: {
        ...(guid ? { guid: guid as string } : {}),
        ...(title ? { title: Like(`%${title}%`) } : {}),
        ownerId: existUser.id,
      },
    });
    return res.status(200).json(EventMapper.map(event));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: messages.errorServer });
  }
}

async function create(req: Request, res: Response) {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      notificationTime,
      userGuid,
    } = req.body;

    const existUser = await dataSource
      .getRepository(User)
      .findOne({ where: { guid: userGuid } });
    if (!existUser)
      return res.status(400).json({ error: messages.userNotFound });

    const event = await dataSource
      .getRepository(Event)
      .create({
        title,
        description,
        startTime,
        endTime,
        ...(notificationTime ? { notificationTime } : {}),
        ownerId: existUser.id,
      })
      .save({ reload: true });

    return res.status(200).json(EventMapper.map(event));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: messages.errorServer });
  }
}

async function edit(req: Request, res: Response) {
  try {
    const { guid } = req.params;
    const { title, description, startTime, endTime, notificationTime } =
      req.body;

    const event = await dataSource
      .getRepository(Event)
      .findOne({ where: { guid: guid } });
    if (!event) return res.status(404).json({ error: messages.eventNotFound });

    event.title = title || event.title;
    event.description = description || event.description;
    event.startTime = startTime || event.startTime;
    event.endTime = endTime || event.endTime;
    event.notificationTime = notificationTime || event.notificationTime;

    await event.save({ reload: true });

    return res.status(200).json(EventMapper.map(event));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: messages.errorServer });
  }
}

async function destroy(req: Request, res: Response) {
  try {
    const { guid } = req.params;

    const event = await dataSource
      .getRepository(Event)
      .findOne({ where: { guid: guid } });
    if (!event) return res.status(404).json({ error: messages.eventNotFound });

    await event.softRemove({ reload: true });

    return res.status(200).json({
      guid,
      title: event.title,
      deletedAt: event.deletedAt,
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

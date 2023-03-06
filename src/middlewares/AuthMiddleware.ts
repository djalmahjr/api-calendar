import { User, dataSource } from '@djalmahjr/lib-database-calendar';
import { NextFunction, Request, Response } from 'express';
import jwt, { SigningKeyCallback } from 'jsonwebtoken';
import { promisify } from 'util';
import { messages } from '../i18n/pt';
import { jwtSecret } from '../config/AuthConfig';

interface Token extends SigningKeyCallback {
  guid: string;
  isAdmin?: boolean;
}

type JwtPromisify = (
  token: string,
  secret: string
) => Promise<SigningKeyCallback>;

export async function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(400).json({ error: messages.tokenNotProvided });

  const [, token] = authHeader.split(' ');

  try {
    const decoded = (await (promisify(jwt.verify) as JwtPromisify)(
      token,
      jwtSecret
    )) as Token;

    const user = await dataSource.getRepository(User).findOne({
      where: {
        guid: decoded?.guid,
      },
    });

    req.currentUser = user;

    if (!user)
      return res.status(403).json({ error: messages.userNotAutenticate });

    return next();
  } catch (err) {
    console.log('Error: JWTValidator' + err);
    return res.status(403).json({ error: messages.errorServer });
  }
}

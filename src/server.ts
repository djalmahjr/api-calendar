import express, { json } from 'express';
import cors from 'cors';
import routes from './routes';
import { connection } from '@djalmahjr/lib-database-calendar';

async function start() {
  await connection();
  const app = express();

  app.use(cors());
  app.use(json({ limit: '20mb' }));
  app.use('/v1', routes);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => console.log(`Server is opened on port: ${PORT}`));
}

start().then();

import { Router } from 'express';
import { list } from './controllers/UserController';

const routes = Router();

routes.route('/users').get(list);

export default routes;

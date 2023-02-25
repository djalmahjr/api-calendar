import { Router } from 'express';
import UserController from './controllers/UserController';

const routes = Router();

routes.route('/users').get(UserController.list).post(UserController.create);
routes
  .route('/users/:guid')
  .put(UserController.edit)
  .delete(UserController.destroy);

export default routes;

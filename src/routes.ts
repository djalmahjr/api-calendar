import { Router } from 'express';
import EventController from './controllers/EventController';
import UserController from './controllers/UserController';

const routes = Router();

routes.route('/users').get(UserController.list).post(UserController.create);
routes
  .route('/users/:guid')
  .put(UserController.edit)
  .delete(UserController.destroy);

routes.route('/events').get(EventController.list).post(EventController.create);
routes
  .route('/events/:guid')
  .put(EventController.edit)
  .delete(EventController.destroy);

export default routes;

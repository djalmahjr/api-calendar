import { Router } from 'express';
import EventController from './controllers/EventController';
import UserController from './controllers/UserController';
import AuthController from './controllers/AuthController';
import { AuthMiddleware } from './middlewares/AuthMiddleware';

const routes = Router();

routes.route('/authenticate').post(AuthController.create);

routes
  .route('/users')
  .get(AuthMiddleware, UserController.list)
  .post(UserController.create);
routes
  .route('/users/:guid')
  .put(AuthMiddleware, UserController.edit)
  .delete(AuthMiddleware, UserController.destroy);

routes
  .route('/events')
  .get(AuthMiddleware, EventController.list)
  .post(AuthMiddleware, EventController.create);
routes
  .route('/events/:guid')
  .put(AuthMiddleware, EventController.edit)
  .delete(AuthMiddleware, EventController.destroy);

export default routes;

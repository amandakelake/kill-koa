import Router from '@koa/router';
import AuthController from '../controllers/AuthController';
import ProjectController from '../controllers/ProjectController';
import UserController from '../controllers/UserController';

export const unauthRouter = new Router();
export const authRouter = new Router();

unauthRouter.get('/', (ctx) => {
    ctx.body = `Hello , let's kill Koa`;
});
unauthRouter.post('/auth/login', AuthController.login);
unauthRouter.post('/auth/register', AuthController.register);

authRouter.get('/users', UserController.listUsers);
authRouter.get('/user/detail/:id', UserController.showUserDetail);
authRouter.post('/user/edit/:id', UserController.updateUser);
authRouter.post('/user/del/:id', UserController.deleteUser);

authRouter.get('/projects', ProjectController.getProjectList);
authRouter.post('/project/add', ProjectController.addProject);

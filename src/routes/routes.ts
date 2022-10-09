import Router from '@koa/router';
import AuthController from '../controllers/AuthController';
import UserController from '../controllers/UserController';

const router = new Router();

router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);

router.get('/users', UserController.listUsers);
router.get('/user/detail/:id', UserController.showUserDetail);
router.post('/user/edit/:id', UserController.updateUser);
router.post('/user/del/:id', UserController.deleteUser);

export default router;

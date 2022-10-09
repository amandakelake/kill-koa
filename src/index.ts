import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import { logger } from './middlewares/logger';
import router from './routes/routes';

const app = new Koa();

app.use(logger());
app.use(cors());
app.use(bodyParser());

app.use(router.routes).use(router.allowedMethods());

app.listen(3000);

import cors from '@koa/cors';
import chalk from 'chalk';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import jwt from 'koa-jwt';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { JWT_SECRET } from './constants/jwt';
import { logger } from './middlewares/logger';
import { authRouter, unauthRouter } from './routes/routes';

createConnection().then(() => {
    const app = new Koa();

    app.use(logger());
    app.use(cors());
    app.use(bodyParser());

    // 错误处理，接受下面controller抛出的错误
    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            // 只返回 JSON 格式的响应
            ctx.status = err.status || 500;
            ctx.body = { message: err.message };
        }
    });

    app.use(unauthRouter.routes()).use(unauthRouter.allowedMethods());
    // 注册 JWT 中间件, get请求不需要验证token
    app.use(jwt({ secret: JWT_SECRET }).unless({ method: 'GET' }));
    // app.use(jwt({ secret: JWT_SECRET }));
    // 需要 JWT Token 才可访问的路由
    app.use(authRouter.routes()).use(authRouter.allowedMethods());

    app.listen(3000, async () => {
        console.log(chalk.blue(`server is running: http://localhost:3000`));
    });
}).catch(err => {
    console.log('typeOrm connection error: ', err);
});



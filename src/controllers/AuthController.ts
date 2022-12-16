import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { Context } from 'koa';
import { getManager } from 'typeorm';
import { UnauthorizedException } from '../common/exceptions';
import { JWT_SECRET } from '../constants/jwt';
import { User } from '../entity/user';

export default class AuthController {
    public static async login(ctx: Context) {
        const userRepository = getManager().getRepository(User);

        const reqBody = ctx.request.body as Record<string, any>;

        const user = await userRepository
            .createQueryBuilder()
            .where({ username: reqBody.username })
            .addSelect('User.password')
            .getOne();

        if (!user) {
            throw new UnauthorizedException('用户名不存在');
        } else if (await argon2.verify(user.password, reqBody.password)) {
            ctx.status = 200;
            ctx.body = {
                token: jwt.sign({ id: user.id }, JWT_SECRET),
                id: user.id,
                username: user.username
            };
        } else {
            throw new UnauthorizedException('密码错误');
        }
    }

    public static async register(ctx: Context) {
        const userRepository = getManager().getRepository(User);
        const newUser = new User();
        const { username, email, password } = ctx.request.body as Record<string, any>;
        newUser.username = username || '';
        newUser.email = email || '';
        newUser.password = await argon2.hash(password);

        const user = await userRepository.save(newUser);

        ctx.status = 200;
        ctx.body = user;
    }
}

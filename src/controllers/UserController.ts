import jwt from 'jsonwebtoken';
import { Context } from 'koa';
import { getManager } from 'typeorm';
import { ForbiddenException, NotFoundException } from '../common/exceptions';
import { JWT_SECRET } from '../constants/jwt';

import { User } from '../entity/user';

export default class UserController {
    public static async listUsers(ctx: Context) {
        const userRepository = getManager().getRepository(User);
        const users = await userRepository.find();

        ctx.status = 200;
        ctx.body = users;
    }

    public static async getUserInfo(ctx: Context) {
        const { authorization } = ctx.request.headers;
        if (authorization) {
            const token = authorization.split('Bearer ')[1];
            try {
                jwt.verify(token, JWT_SECRET);
            } catch (e) {
                throw new ForbiddenException(e.message);
            }
            const id = (jwt.decode(token) as { id: number, [key: string]: any }).id;
            const user = await getManager()
                .createQueryBuilder(User, 'user')
                .where('user.id = :id', { id })
                .getOne();

            if (user) {
                ctx.status = 200;
                ctx.body = user;
            } else {
                throw new NotFoundException();
            }
        } else {
            throw new NotFoundException();
        }
    }

    public static async showUserDetail(ctx: Context) {
        const user = await getManager()
            .createQueryBuilder(User, 'user')
            .where('user.id = :id', { id: ctx.params.id })
            .getOne();

        if (user) {
            ctx.status = 200;
            ctx.body = user;
        } else {
            throw new NotFoundException();
        }
    }

    public static async updateUser(ctx: Context) {
        const userId = +ctx.params.id;

        if (userId !== +ctx.state.user.id) {
            throw new ForbiddenException();
        }

        const userRepository = getManager().getRepository(User);
        await userRepository.update(ctx.params.id, ctx.request.body as User);
        const updatedUser = await userRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id: ctx.params.id })
            .getOne();

        if (updatedUser) {
            ctx.status = 200;
            ctx.body = updatedUser;
        } else {
            throw new NotFoundException();
        }
    }

    public static async deleteUser(ctx: Context) {
        const userId = +ctx.params.id;

        if (userId !== +ctx.state.user.id) {
            throw new ForbiddenException();
        }

        const userRepository = getManager().getRepository(User);
        await userRepository.delete(ctx.params.id);

        ctx.status = 204;
    }
}

import { Context } from 'koa';
import * as argon2 from 'argon2';
import { getManager } from 'typeorm';
import { User } from '../entity/user';

export default class AuthController {
	public static async login(ctx: Context) {
		ctx.body = 'Login controller';
	}

	public static async register(ctx: Context) {
		const userRepository = getManager().getRepository(User);
		const newUser = new User();
		const { name = '', email = '', password = '' } = ctx.request.body as Record<string, any>;
		newUser.name = name;
		newUser.email = email;
		newUser.password = await argon2.hash(password);

		const user = await userRepository.save(newUser);

		ctx.status = 201;
		ctx.body = user;
	}
}

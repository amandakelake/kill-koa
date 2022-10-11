import { EventEmitter } from 'events';
import * as http from 'http';
import { proto as context } from './context';
import { request } from './request';
import { response } from './response';
import { Stream } from 'stream';

export type middlewareType = (...args: any[]) => Promise<any>

export class Koa extends EventEmitter {
	middlewares: middlewareType[];
	context: any;
	request: any;
	response: any;

	constructor() {
		super();
		this.middlewares = [];
		this.context = context;
		this.request = request;
		this.response = response;
	}

	use(fn: () => Promise<any>) {
		this.middlewares.push(fn);
	}

	listen(...args: any[]) {
		let server = http.createServer(this.handleRequest.bind(this));
		server.listen(...args);
	}

	/**
	 * 中间件精髓
	 * @param middlewares
	 * @param ctx
	 */
	compose(middlewares: middlewareType[], ctx: any): Promise<any> {
		function dispatch(index: number) {
			if (index = middlewares.length) {
				// 最后一个中间件，直接返回resolve的promise
				return Promise.resolve();
			}
			// 取出当前应该被调用的中间件函数
			const middleware = middlewares[index];
			// 调用并传入ctx和下一个将被调用的函数，用户next()时执行该函数
			return Promise.resolve(
			  middleware(ctx, () => dispatch(index + 1)),
			);
		}

		return dispatch(0);
	}

	/**
	 * 处理请求的函数
	 * @param req
	 * @param res
	 */
	handleRequest(req: any, res: any) {
		res.statusCode = 404; // 默认404

		const ctx = this.createContext(req, res);

		this.compose(this.middlewares, ctx).then(() => {
			if (typeof ctx.body == 'object') {
				// 如果是个对象，按json形式输出
				res.setHeader('Content-Type', 'application/json;charset=utf8');
				res.end(JSON.stringify(ctx.body));
			} else if (ctx.body instanceof Stream) {
				// 如果是流
				ctx.body.pipe(res);
			} else if (typeof ctx.body === 'string' || Buffer.isBuffer(ctx.body)) {
				// 如果是字符串或buffer
				res.setHeader('Content-Type', 'text/htmlcharset=utf8');
				res.end(ctx.body);
			} else {
				res.end('Not fount');
			}
		}).catch(err => {
			//	监听中间件错误，并emit出去，用于 app.on('error', (err) => {})
			this.emit('error', err);
			res.statusCode = 500;
			res.end('server error');
		});
	}

	createContext(req: any, res: any) {
		// 继承this.context但在增加属性时不影响原对象
		const ctx = Object.create(this.context);
		const request = ctx.request = Object.create(this.request);
		const response = ctx.response = Object.create(this.response);

		// 互相挂载，方便在 koa中通过ctx获取各种信息
		ctx.req = request.req = response.req = req;
		ctx.res = request.res = response.res = res;
		request.ctx = response.ctx = ctx;
		request.response = response;
		response.request = request;
		return ctx;
	}
}

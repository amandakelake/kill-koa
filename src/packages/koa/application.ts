import { EventEmitter } from 'events';
import * as http from 'http';

export class Koa extends EventEmitter {
	fn: () => Promise<any>;

	constructor() {
		super();
	}

	use(fn: () => Promise<any>) {
		this.fn = fn;
	}

	listen(...args: any[]) {
		let server = http.createServer(this.fn);
		server.listen(...args);
	}
}

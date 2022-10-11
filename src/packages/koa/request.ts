import url from 'url';

const request = {
	get url(): string {
		// @ts-ignore
		return this.req.url;
	},
	get path(): string {
		// @ts-ignore
		return url.parse(this.req.url).pathname;
	},

	get query(): string {
		// @ts-ignore
		return url.parse(this.req.url).query;
	},
};

export {
	request,
};

const response = {
	get body(): any {
		// @ts-ignore
		return this._body;
	},
	set body(value) {
		// @ts-ignore
		this.res.statusCode = 200;
		// @ts-ignore
		this._body = value;
	},
};

export {
	response,
};

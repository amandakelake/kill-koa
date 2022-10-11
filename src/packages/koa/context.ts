let proto = {};

function defineGetter(prop: string, name: string) {
	// @ts-ignore
	proto.__defineGetter__(name, function () {
		// @ts-ignore
		return this[prop][name];
	});
}

function defineSetter(prop: string, name: string) {
	// @ts-ignore
	proto.__defineSetter__(name, function (val) {
		// @ts-ignore
		this[prop][name] = val;
	});
}

defineGetter('request', 'url');
defineGetter('request', 'path');

defineGetter('response', 'body');
defineSetter('response', 'body');

export {
	proto,
};

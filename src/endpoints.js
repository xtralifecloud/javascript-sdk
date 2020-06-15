/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const endpoints = {
	url: "https://sandbox-api01.clanofthecloud.mobi",

	current: { //default is sandbox
		url: 'https://sandbox-api[id].clanofthecloud.mobi',
		count: 2
	},

	sandbox: {
		url: 'https://sandbox-api[id].clanofthecloud.mobi',
		count: 2
	},

	prod: {
		url: 'https://prod-api[id].clanofthecloud.mobi',
		count: 16
	},

	dev: {
		url: 'http://localhost:2000',
		count: 1
	}
};

module.exports = {

	set(endpoint) {
		if (endpoint === "sandbox") {
			endpoints.current = endpoints.sandbox;
		} else if (endpoint === "prod") {
			endpoints.current = endpoints.prod;
		} else if (endpoint === "dev") {
			endpoints.current = endpoints.dev;
		} else if ((typeof (endpoint) === 'string') && (endpoint !== "")) {
			endpoints.current = { url: endpoint, count: 1 };
		} else { throw new Error("endpoint must be either dev|sandbox|prod or an url"); }

		endpoints.url = endpoints.current.url;
		return this.tryOther();
	},

	current() {
		if (endpoints.url != null) { return endpoints.url; }
		this.tryOther;
		return endpoints.url;
	},

	tryOther() {
		if (endpoints.current.url.indexOf("[id]") !== -1) {
			endpoints.url = endpoints.current.url.replace("[id]", ("0" + Math.floor((Math.random() * endpoints.current.count) + 1)).slice(-2));
			return console.log(`new url : ${endpoints.url}`);
		}
	}
};


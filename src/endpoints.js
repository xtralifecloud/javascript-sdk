/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const endpoints = {
	url: "http://localhost:2000",
};

module.exports = {

	set(endpoint) {
		if ((typeof (endpoint) === 'string') && (endpoint !== "")) {
			endpoints.current = { url: endpoint};
		} else { throw new Error("endpoint must be an url and not empty"); }
		endpoints.url = endpoints.current.url;
		return;
	},

	current() {
		return endpoints.url;
	},
};


/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const endpoint = require('./endpoint.js');

module.exports = function (request) {
	request.url = endpoint.get() + request.url;
	return request;
};

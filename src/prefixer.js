/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const Endpoints = require('./endpoints.js');

module.exports = function (request) {
	request.url = Endpoints.current() + request.url;
	return request;
};

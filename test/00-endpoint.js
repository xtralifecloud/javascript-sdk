require('mocha')
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Endpoints = require('../src/endpoints.js');

describe("Set endpoint", function () {

	// it("should set the endpoint to local", () => Endpoints.set('dev'));

	it("should set the endpoint to sandbox", () => Endpoints.set('sandbox'));

	// DONT it.skip("should set the endpoint to production", () => Endpoints.set('prod'));
});

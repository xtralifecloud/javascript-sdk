require('mocha')
const should = require('should');
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Endpoint = require('../src/endpoint.js');

describe("Set endpoint", function() {
    it("should set the endpoint to http://localhost:2000", () => Endpoint.set('http://localhost:2000'));
});

describe("Get endpoint", function() {
    it("should get the endpoint and return http://localhost:2000", () => {
        console.log(Endpoint.get());
        should(Endpoint.get() == 'http://localhost:2000').be.true();
    })
});
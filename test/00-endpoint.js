require('mocha')
const should = require('should');
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const Endpoint = require('../src/endpoint.js');
const dataset = require('./0-dataset.json');

describe("Set endpoint", function() {
    it("should set the endpoint to " + dataset.endpoint, () => Endpoint.set(dataset.endpoint));
});

describe("Get endpoint", function() {
    it("should get the endpoint and return " + dataset.endpoint, () => {
        console.log(Endpoint.get());
        should(Endpoint.get() == dataset.endpoint).be.true();
    })
});
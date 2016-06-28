Endpoints = require '../src/endpoints.coffee'

describe "Set endpoint", ->

	it "should set the endpoint to local", ->
		Endpoints.set 'http://localhost:2000'

	it.skip "should set the endpoint to sandbox", ->
		Endpoints.set 'sandbox'

	it.skip "should set the endpoint to production", ->
		Endpoints.set 'prod'

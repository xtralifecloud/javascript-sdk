Endpoints = require '../src/endpoints.coffee'

describe "Set endpoint", ->

	it.skip "should set the endpoint to local", ->
		Endpoints.set 'dev'

	it "should set the endpoint to sandbox", ->
		Endpoints.set 'sandbox'

	it.skip "should set the endpoint to production", ->
		Endpoints.set 'prod'

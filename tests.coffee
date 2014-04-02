
mocha = require "mocha"
should = require "should"
rs = require "randomstring"
async = require "async"

ApiClient = require "./apiclient.coffee"

apiclient = ApiClient.client

EndPoints = ApiClient.loadbalancers

# ------------------------------------------------
# ------------------------------------------------

authapi =
	apikey: 'cloudbuilder-key'
	apisecret: 'azerty'

authapibadsecret =
	apikey: 'cloudbuilder-key'
	apisecret: 'qaqaq'
	user: 'roro'
	pass: 'ssap'

authapibadkey =
	apikey: 'cloudbuilder-key-false'
	apisecret: 'qaqaq'
	user: 'roro'
	pass: 'ssap'


authuser =
	apikey: 'cloudbuilder-key'
	apisecret: 'azerty'
	user: 'roro'
	pass: 'pass'


describe "Shuttle HTTP tests", ()->

	describe "basic requests", ()->

		console.log EndPoints
		client = new apiclient EndPoints, authapi.apikey, authapi.apisecret

		describe "basic requests should success", ()->

			it "/api/test/dummy with empty json should be ok", (done)->
				client.call '/api/test/dummy', {}, (err, resp, body)->
					should(err).not.be.ok
					resp.statusCode.should.be.equal(200)
					body.should.have.property('dummy')
					done()

			it "/api/test/slow should be ok", (done)->
				client.call '/api/test/slow', {delay: 1000} , (err, resp, body)->
					should(err).not.be.ok
					resp.statusCode.should.be.equal(200)
					body.should.have.property('responseTime')
					done()

		describe "basic requests should fail", ()->

			it "/api/test/checkwanted with missing parameter should be 400, MissingArgument", (done)->
				client.call '/api/test/checkwanted', { missing : true}, (err, resp, body)->
					should(err).not.be.ok
					resp.statusCode.should.be.equal(400)
					body.should.have.property('code')
					body.code.should.be.equal('MissingArgument')
					done()

			it "/api/test/badarg should be 400, BadArgument", (done)->
				client.call '/api/test/badarg', {d1:1, d2: 2}, (err, resp, body)->
					should(err).not.be.ok
					resp.statusCode.should.be.equal(400)
					body.should.have.property('code')
					body.code.should.be.equal("BadArgument")
					done()

			it "/api/test/missing should be 404, NotFound", (done)->
				client.call '/api/test/missing', {d1:1, d2: 2}, (err, resp, body)->
					should(err).not.be.ok
					resp.statusCode.should.be.equal(404)
					body.should.have.property('code')
					body.code.should.be.equal('NotFound')
					done()

		describe.skip "basic requests should crash the server", ()->

			it "/api/test/crash should be 500", (done)->
				client.call '/api/test/crash', {d1:1, d2: 2}, (err, resp, body)->
					should(err).not.be.ok
					resp.statusCode.should.be.equal(500)
					body.should.have.property('code')
					body.code.should.be.equal('InternalError')
					done()

			it "/api/test/throw should be 500", (done)->
				client.call '/api/test/throw', {d1:1, d2: 2}, (err, resp, body)->
					should(err).not.be.ok
					resp.statusCode.should.be.equal(500)
					body.should.have.property('code')
					body.code.should.be.equal('InternalError')
					done()

	describe "authentication requests", ()->

		describe "authentication should success", ()->

			client = new apiclient EndPoints, authuser.apikey, authuser.apisecret

			it "/api/test/dummy should be ok", (done)->
				client.call '/api/test/dummy', {d1:1, d2 : { dd2:"aaaaaa", dd3: [1,2,3]}}, (err, resp, body)->
					should(err).not.be.ok
					resp.statusCode.should.be.equal(200)
					body.should.have.property('dummy')
					done()

			client.auth authuser.user, authuser.pass

			it "/api/user/test/dummy should be ok", (done)->
				client.call '/api/user/test/dummy', {d1:1, d2 : { dd2:"aaaaaa", dd3: [1,2,3]}}, (err, resp, body)->
					should(err).not.be.ok
					resp.statusCode.should.be.equal(200)
					body.should.have.property('dummy')
					done()

			it "/api/user/test/echo should be ok", (done)->
				echo = { msg: rs.generate(10) }
				client.call '/api/user/test/echo', echo, (err, resp, body)->
					should(err).not.be.ok
					resp.statusCode.should.be.equal(200)
					echo.msg.should.be.equal(body.msg)
					done()

			it "/api/user/method/profile should be ok", (done)->
				client.call '/api/user/method/profile', {}, (err, resp, body)->
					should(err).not.be.ok
					resp.statusCode.should.be.equal(200)
					done()

		describe "authentication should fail", ()->


			it "/api/test/dummy with bad apikey should be 401, Unauthorized", (done)->
				client = new apiclient EndPoints, authapibadkey.apikey, authapibadkey.apisecret
				client.call '/api/test/dummy', {d1:1, d2 : { dd2:"aaaaaa", dd3: [1,2,3]}}, (err, resp, body)->
					should(err).not.be.ok
					resp.statusCode.should.be.equal(401)
					body.should.have.property('code')
					body.code.should.be.equal('Unauthorized')
					done()

			it "/api/test/dummy with bad apisecret should be 401, Unauthorized", (done)->
				client = new apiclient EndPoints, authapibadsecret.apikey, authapibadsecret.apisecret
				client.call '/api/test/dummy', {d1:1, d2 : { dd2:"aaaaaa", dd3: [1,2,3]}}, (err, resp, body)->
					should(err).not.be.ok
					resp.statusCode.should.be.equal(401)
					body.should.have.property('code')
					body.code.should.be.equal('Unauthorized')
					done()

			it "/api/user/test/dummy with missing user should be 401, Unauthorized", (done)->
				client = new apiclient EndPoints, authapi.apikey, authapi.apisecret
				client.call '/api/user/test/dummy', {d1:1, d2 : { dd2:"aaaaaa", dd3: [1,2,3]}}, (err, resp, body)->
					should(err).not.be.ok
					resp.statusCode.should.be.equal(401)
					body.should.have.property('code')
					body.code.should.be.equal('Unauthorized')
					done()

			client = new apiclient EndPoints, authapi.apikey, authapi.apisecret
			client.auth authapibadkey.user, authapibadkey.pass

			it "/api/user/test/dummy with bad user should be 401, Unauthorized", (done)->
				client.call '/api/user/test/dummy', {d1:1, d2 : { dd2:"aaaaaa", dd3: [1,2,3]}}, (err, resp, body)->
					should(err).not.be.ok
					resp.statusCode.should.be.equal(401)
					body.should.have.property('code')
					body.code.should.be.equal('Unauthorized')
					done()

			it.skip "/api/test/dummy with bad nonce should be 417, OutdatedRequest ", (done)->
				client.call '/api/test/dummy', {d1:1, d2 : { dd2:"aaaaaa", dd3: [1,2,3]}}, (err, resp, body)->
					should(err).not.be.ok
					resp.statusCode.should.be.equal(417)
					body.should.have.property('code')
					body.code.should.be.equal('OutdatedRequest')
					done()

describe.skip "try something", ()->
	it "test", (done)->
		done()

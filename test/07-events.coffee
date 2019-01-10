should = require 'should'

Clan = require('../src/Clan.coffee')('testgame-key', 'testgame-secret') # app credentials

dataset = require './0-dataset.json'

gamerCred = null

describe 'Events', ->

	msgid = null

	events = null

	before 'should login first as friend', (done)->
		Clan.login 'anonymous', dataset.friend_id, dataset.friend_token, (err, gamer)->
			if err? then return done(err)
			gamer.should.have.property('gamer_id')
			gamer.should.have.property('gamer_secret')
			events = Clan.withGamer(gamer).events('private')
			done()

	it 'should send a message', (done)->
		events.send dataset.gamer_id, {hello: 'friend'}, (err, res)->
			should(err).be.null
			msgid = res.id
			done()

	it 'should have sent message to other user', (done)->
		Clan.login 'anonymous', dataset.gamer_id, dataset.gamer_token, (err, gamer)->
			gamer.should.have.property('gamer_id')
			gamer.should.have.property('gamer_secret')
			events = Clan.withGamer(gamer).events('private')

			events.receive 'auto', (err, message)->
				should(err).be.null
				message.event.hello.should.be.eql 'friend'
				message.id.should.be.eql msgid
				done()

	it 'should block until timeout', (done)->
		events.receive 'auto', (err, message)->
			should(err).be.null
			message.event.hello.should.be.eql 'friend'
			done()

		setTimeout ->
			events.send dataset.gamer_id, {hello: 'friend'}, (err, res)->
				should(err).be.null
		, 500

	it.skip 'should block until timeout', (done)->
		this.timeout 50000
		events.setTimeout 8000

		events.receive 'auto', (err, message)->
			should(err).be.null
			should(message).be.null
			events.receive 'auto', (err, message)->
				should(err).be.null
				message.event.hello.should.be.eql 'friend'
				done()

		setTimeout ->
			events.send dataset.gamer_id, {hello: 'friend'}, (err, res)->
				should(err).be.null
		, 10000

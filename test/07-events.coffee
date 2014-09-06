should = require 'should'

Clan = require('../src/Clan.coffee')('testgame-key', 'testgame-secret') # app credentials

dataset = require './0-dataset.json'

gamerCred = null

describe 'Events', ->

	msgid = null

	it 'should login first as friend', (done)->
		Clan.login 'anonymous', dataset.friend_id, dataset.friend_token, (err, gamer)->
			gamer.should.have.property('gamer_id')
			gamer.should.have.property('gamer_secret')
			gamerCred = Clan.createGamerCredentials(gamer)
			done()

	it 'should send a message', (done)->
		Clan.event('private').send gamerCred, dataset.gamer_id, {hello: 'friend'}, (err, res)->
			should(err).be.null
			msgid = res.id
			done()

	it 'should have sent message to other user', (done)->
		Clan.login 'anonymous', dataset.gamer_id, dataset.gamer_token, (err, gamer)->
			gamer.should.have.property('gamer_id')
			gamer.should.have.property('gamer_secret')
			gamerCred = Clan.createGamerCredentials(gamer)

			Clan.event('private').receive gamerCred, 'auto', (err, message)->
				should(err).be.null
				message.hello.should.be.eql 'friend'
				message.id.should.be.eql msgid
				done()

	it 'should block until timeout', (done)->
		Clan.event('private').receive gamerCred, 'auto', (err, message)->
			should(err).be.null
			message.hello.should.be.eql 'friend'
			done()

		setTimeout ->
			Clan.event('private').send gamerCred, dataset.gamer_id, {hello: 'friend'}, (err, res)->
				should(err).be.null
		, 500

	it 'should block until timeout', (done)->
		Clan.event('private').setTimeout 500

		Clan.event('private').receive gamerCred, 'auto', (err, message)->
			should(err).be.null
			should(message).be.null
			Clan.event('private').receive gamerCred, 'auto', (err, message)->
				should(err).be.null
				message.hello.should.be.eql 'friend'
				done()

		setTimeout ->
			Clan.event('private').send gamerCred, dataset.gamer_id, {hello: 'friend'}, (err, res)->
				should(err).be.null
		, 700

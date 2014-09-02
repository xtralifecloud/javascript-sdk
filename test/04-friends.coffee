should = require 'should'

Clan = require('../src/Clan.coffee')('cloudbuilder-key', 'azerty')

dataset = require './0-dataset.json'

gamerCred = null

describe 'Gamer Friends', ->

	friends = Clan.friends()

	it 'it should login first', (done)->
		Clan.login 'anonymous', dataset.gamer_id, dataset.gamer_token, (err, gamer)->
			gamer.should.have.property('gamer_id')
			gamer.should.have.property('gamer_secret')
			gamerCred = Clan.createGamerCredentials(gamer)
			done()

	it 'should call change relationship to friend', (done)->
		friends.status gamerCred, dataset.friend_id, "add", (err, res)->
			res.should.have.property("done")
			done()

	it 'should call get', (done)->
		friends.get gamerCred, (err, res)->
			if err? then return done(err)
			res.should.containDeep([{gamer_id: dataset.friend_id }])
			done()

	it 'should call change relationship to blacklist', (done)->
		friends.status gamerCred, dataset.friend_id, "blacklist", (err, res)->
			res.should.have.property("done")
			done()

	it 'should call getBlacklisted', (done)->
		friends.getBlacklisted gamerCred, (err, res)->
			res.should.containDeep([{gamer_id: dataset.friend_id }])
			done()

	it 'should call change relationship to forget', (done)->
		friends.status gamerCred, dataset.friend_id, "forget", (err, res)->
			res.should.have.property("done")
			done()



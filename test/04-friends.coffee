should = require 'should'

Clan = require('../src/Clan.coffee')('testgame-key', 'testgame-secret') # app credentials

dataset = require './0-dataset.json'

gamerCred = null

describe 'Gamer Friends', ->

	friends = Clan.friends()

	before 'it should login first', (done)->
		Clan.login 'anonymous', dataset.gamer_id, dataset.gamer_token, (err, gamer)->
			gamer.should.have.property('gamer_id')
			gamer.should.have.property('gamer_secret')
			gamerCred = Clan.createGamerCredentials(gamer)
			done()

	it 'should create a friend', (done)->

		Clan.login null, (err, gamer)->
			gamer.should.have.property('gamer_id')
			gamer.should.have.property('gamer_secret')

			dataset.friend_id = gamer.gamer_id
			dataset.friend_token = gamer.gamer_secret
			done()

	it 'should call change relationship to friend', (done)->
		friends.status gamerCred, dataset.friend_id, "add", (err, res)->
			res.should.have.property("done")
			done()

	it 'should call get', (done)->
		friends.get gamerCred, (err, res)->
			if err? then return done(err)
			res.friends.should.containDeep([{gamer_id: dataset.friend_id }])
			done()

	it 'should call change relationship to blacklist', (done)->
		friends.status gamerCred, dataset.friend_id, "blacklist", (err, res)->
			res.should.have.property("done")
			done()

	it 'should call getBlacklisted', (done)->
		friends.getBlacklisted gamerCred, (err, res)->
			res.blacklisted.should.containDeep([{gamer_id: dataset.friend_id }])
			done()

	it 'should call change relationship to forget', (done)->
		friends.status gamerCred, dataset.friend_id, "forget", (err, res)->
			res.should.have.property("done")
			done()



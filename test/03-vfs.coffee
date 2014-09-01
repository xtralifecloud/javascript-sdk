should = require 'should'

Clan = require('../src/Clan.coffee')('cloudbuilder-key', 'azerty')

dataset = require './0-dataset.json'

gamerCred = null

describe 'Gamer VFS', ->

	vfs = Clan.gamervfs(Clan.privateDomain)

	it 'it should login first', (done)->
		Clan.login 'anonymous', dataset.gamer_id, dataset.gamer_token, (err, gamer)->
			gamer.should.have.property('gamer_id')
			gamer.should.have.property('gamer_secret')
			gamerCred = Clan.createGamerCredentials(gamer)
			done()

	it 'should call set', (done)->
		vfs.set gamerCred, "test", {hello: "world"}, (err, count)->
			if err? then return done(err)
			count.should.eql(1)
			done()

	it 'should call get', (done)->
		vfs.get gamerCred, "test", (err, res)->
			res.should.eql {hello: "world"}
			done()

	it 'should call del', (done)->
		vfs.del gamerCred, "test", (err, count)->
			count.should.eql(1)
			done()



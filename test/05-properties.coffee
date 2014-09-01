should = require 'should'

Clan = require('../src/Clan.coffee')('cloudbuilder-key', 'azerty')

dataset = require './0-dataset.json'

gamerCred = null

describe 'Gamer Properties', ->

	properties = Clan.properties()

	it 'it should login first', (done)->
		Clan.login 'anonymous', dataset.gamer_id, dataset.gamer_token, (err, gamer)->
			gamer.should.have.property('gamer_id')
			gamer.should.have.property('gamer_secret')
			gamerCred = Clan.createGamerCredentials(gamer)
			done()

	it 'should set a property', (done)->
		properties.set gamerCred, "board",  "square", (err, res)->
			res.should.have.property("done")
			done()


	it 'should set another property', (done)->
		properties.set gamerCred, "level",  10, (err, res)->
			res.should.have.property("done")
			done()

	it 'should get a property', (done)->
		properties.get gamerCred, "board", (err, res)->
			done()


	it 'should get a all properties', (done)->
		properties.load gamerCred, (err, res)->
			res.should.have.property("done")
			done()

	it 'should del a property', (done)->
		properties.delete gamerCred, "board", (err, res)->
			done()

	it 'should replace all properties', (done)->
		properties.save gamerCred , { board : "round", level : 20 }, (err, res)->
			res.should.have.property("done")
			done()

	it 'should delete all properties', (done)->
		properties.remove gamerCred, (err, res)->
			res.should.have.property("done")
			done()

should = require 'should'

Clan = require('../src/Clan.coffee')('testgame-key', 'testgame-secret') # app credentials

dataset = require './0-dataset.json'

gamerCred = null

describe 'Gamer Properties', ->

	properties = null

	it 'it should login first', (done)->
		Clan.login null, (err, gamer)->
			gamer.should.have.property('gamer_id')
			gamer.should.have.property('gamer_secret')
			properties = Clan.withGamer(gamer).properties('private')
			done()

	it 'should set a property', (done)->
		properties.set "board",  "square", (err, res)->
			res.should.have.property("done")
			done()


	it 'should set another property', (done)->
		properties.set "level",  10, (err, res)->
			res.should.have.property("done")
			done()

	it 'should get a property', (done)->
		properties.get "board", (err, res)->
			done()


	it 'should get a all properties', (done)->
		properties.load (err, res)->
			res.should.have.property("properties")
			done()

	it 'should del a property', (done)->
		properties.delete "board", (err, res)->
			res.should.have.property("done")
			done()

	it 'should replace all properties', (done)->
		properties.save  { board : "round", level : 20 }, (err, res)->
			res.should.have.property("done")
			done()

	# removed from the API, use the indexing API instead
	it.skip 'should find a user matching properties', (done)->
		properties.find { level : {'$gt' : 10}}, (err, res)->
			res.should.have.property("gamers")
			done()

	it 'should delete all properties', (done)->
		properties.remove (err, res)->
			res.should.have.property("done")
			done()


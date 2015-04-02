should = require 'should'

Clan = require('../src/Clan.coffee')('testgame-key', 'testgame-secret') # app credentials

dataset = require './0-dataset.json'

gamerCred = null

describe 'Gamer Profile', ->

	profile = null

	before 'it should login first', (done)->
		Clan.login null, (err, gamer)->
			gamer.should.have.property('gamer_id')
			gamer.should.have.property('gamer_secret')
			profile = Clan.withGamer(gamer).profile()
			done()

	it 'should fetch the profile', (done)->
		profile.get (err, res)->
			should.exist res.displayName
			res.lang.should.eql 'en'
			done()

	it 'should alter the profile', (done)->
		newName = 'The Roxxor' + Math.floor(Math.random() * 10000)
		profile.set {displayName: newName}, (err, res)->
			res.done.should.eql 1
			res.profile.displayName.should.eql newName
			
			profile.get (err, res)->
				res.displayName.should.eql newName
				done()

should = require 'should'

Clan = require('../src/Clan.coffee')('testgame-key', 'testgame-secret') # app credentials

dataset = require './0-dataset.json'

gamerCred = null

describe 'Batches', ->

	savedGamer = null

	it.skip 'should allow calling unauthenticated batches', (done)->
		Clan.runBatch "private", 'batchFromJS', {params: "work fine"}, (err, res)->
			if err? then return done err
			res.works.should.eql true
			res.params.request.should.eql {params: 'work fine'}
			done()

	it 'should log in', (done)->
		Clan.login null, (err, gamer)->
			gamer.should.have.property('gamer_id')
			gamer.should.have.property('gamer_secret')
			savedGamer = gamer
			done()

	it.skip 'should allow calling authenticated batches', (done)->
		Clan.withGamer(savedGamer).runBatch "private", 'batchFromJS', {params: "work fine"}, (err, res)->
			if err? then return done err
			res.works.should.eql true
			res.params.request.should.eql {params: 'work fine'}
			res.params.user_id.should.eql savedGamer.gamer_id
			#res.params.gamer_id.should.eql savedGamer.gamer_id
			done()


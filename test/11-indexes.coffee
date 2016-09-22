should = require 'should'

Clan = require('../src/Clan.coffee')('testgame-key', 'testgame-secret') # app credentials

dataset = require './0-dataset.json'

_gamer = null
_friend = null

describe 'Indexes', ->

	indexes = Clan.indexes(Clan.privateDomain)

	it 'it should login first', (done)->
		Clan.login null, (err, gamer)->
			gamer.should.have.property('gamer_id')
			gamer.should.have.property('gamer_secret')
			_gamer = gamer
			Clan.login null, (err, friend)->
				friend.should.have.property('gamer_id')
				friend.should.have.property('gamer_secret')
				_friend = friend
				done()


	it 'should create an index for gamer', (done)->
		properties = 
			level : 20
			xp : 2016

		payload = 
			whatever : "something"

		indexes.set "testindex", _gamer.gamer_id, properties, payload, (err, res)->
			if err? then return done(err)
			should.exist(res.created)
			res.created.should.be.true
			done()

	it 'should create an index for friend', (done)->
		properties = 
			level : 18
			xp : 2010

		payload = 
			whatever : "something else"

		indexes.set "testindex", _friend.gamer_id, properties, payload, (err, res)->
			if err? then return done(err)
			should.exist(res.created)
			res.created.should.be.true
			done()

	it 'should get gamer index', (done)->
		indexes.get "testindex", _gamer.gamer_id, (err, res)->
			if err? then return done(err)
			should.exist(res.found)
			res.found.should.be.true
			res._source.payload.whatever.should.eql 'something'
			done()


	it 'should search index and sort', (done)->
		indexes.search "testindex", "*", '["level:desc"]', 0, 10, (err, res)->
			if err? then return done(err)
			should.exist(res.total)
			should.exist(res.hits)
			res.total.should.eql(1)
			res.hits[0]._source.payload.whatever.should.eql 'something'
			done()

	it 'should query index', (done)->
		q = 
			query:
				range :
					level :
						from : 15
						to : 25

		indexes.query "testindex", q, 0, 10, (err, res)->
			if err? then return done(err)
			should.exist(res.total)
			res.total.should.greaterThan(1)
			done()


	it 'should update friend index', (done)->
		properties = 
			level : 22
			xp : 2016

		payload = 
			whatever : "other"

		indexes.set "testindex", _friend.gamer_id, properties, payload, (err, res)->
			if err? then return done(err)
			should.exist(res.created)
			res.created.should.be.false
			done()

	it 'should query index', (done)->
		q = 
			query:
				range :
					level :
						from : 15
						to : 20
						include_upper: true

		indexes.query "testindex", q, 0, 10, (err, res)->
			if err? then return done(err)
			should.exist(res.total)
			res.total.should.greaterThan(0)
			done()



	it 'should delete gamer index', (done)->
		indexes.del "testindex", _gamer.gamer_id, (err, res)->
			if err? then return done(err)
			should.exist(res.found)
			res.found.should.be.true
			done()

	it 'should delete friend index', (done)->
		indexes.del "testindex", _friend.gamer_id, (err, res)->
			if err? then return done(err)
			should.exist(res.found)
			res.found.should.be.true
			done()




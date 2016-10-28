should = require 'should'

Clan = require('../src/Clan.coffee')('testgame-key', 'testgame-secret') # app credentials

dataset = require './0-dataset.json'

gamerCred = null

describe 'Gamer VFS', ->

	vfs = null

	it 'it should login first', (done)->
		Clan.login null, (err, gamer)->
			gamer.should.have.property('gamer_id')
			gamer.should.have.property('gamer_secret')
			vfs = Clan.withGamer(gamer).gamervfs(Clan.privateDomain)
			done()

	it 'should call set', (done)->
		vfs.set "test", {hello: "world"}, (err, count)->
			if err? then return done(err)
			count.should.eql {"done": 1}
			done()

	it 'should set a string too', (done)->
		vfs.set "test2", 'hello world', (err, count)->
			if err? then return done(err)
			count.should.eql {"done": 1}
			vfs.get "test2", (err, res)->
				res.should.eql 'hello world'
				done()

	it 'should call get', (done)->
		vfs.get "test", (err, res)->
			res.should.eql {hello: "world"}
			done()

	it 'should call del', (done)->
		vfs.del "test", (err, count)->
			count.should.eql {"done": 1}
			done()


# skipped because there's no default VFS key we can test, and we can't create one
describe.skip 'Game VFS', ->

	gamevfs = Clan.vfs(Clan.privateDomain)

	it 'should call get', (done)->
		gamevfs.get "testkey", (err, res)->
			if err? then return done(err)
			should(res).be.not.null
			res.should.eql { test : 2 }
			done()


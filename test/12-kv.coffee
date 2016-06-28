should = require 'should'

Clan = require('../src/Clan.coffee')('testgame-key', 'testgame-secret') # app credentials

dataset = require './0-dataset.json'

gamerCred = null

describe 'KV store', ->

	kv = null

	it 'it should login first', (done)->
		Clan.login null, (err, gamer)->
			gamer.should.have.property('gamer_id')
			gamer.should.have.property('gamer_secret')
			kv = Clan.withGamer(gamer).kv(Clan.privateDomain)
			done()

	# skipped because it doesn't exist by default
	it.skip 'should call get', (done)->
		kv.get "testjskey", (err, res)->
			if err? then return done(err)
			should.exist(res.key)
			res.key.should.eql("testjskey")
			done()

	it 'should call set', (done)->
		kv.set "testjskey", "hello", (err, res)->
			if err? then return done(err)
			should.exist(res.ok)
			res.ok.should.eql(1)
			done()

	it 'should change acl', (done)->
		kv.acl "testjskey", {r:'*', w:'*', a:'*'}, (err, res)->
			if err? then return done(err)
			should.exist(res.ok)
			res.ok.should.eql(1)
			done()

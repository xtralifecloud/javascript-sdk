should = require 'should'

Clan = require('../src/Clan.coffee')('cloudbuilder-key', 'azerty')

gamerCred = null

describe 'Gamer transactions', ->

	balance = null
	history = null

	it 'it should login first', (done)->
		Clan.login 'anonymous', '536cf67b2a4d430000a6b9bf', 'a1b399f71c868faf0848c959ac6b290b6169750d', (err, gamer)->
			gamer.should.have.property('gamer_id')
			gamer.should.have.property('gamer_secret')
			gamerCred = Clan.createGamerCredentials(gamer)
			done()

	it 'should call balance', (done)->
		Clan.transactions.balance gamerCred, (err, aBalance)->
			if err? then return done(err)
			balance = aBalance
			done()

	it 'should call history', (done)->
		Clan.transactions.history gamerCred, (err, aHistory)->
			if err? then return done(err)
			history = aHistory
			done()

	it 'should send a transaction', (done)->
		Clan.transactions.create gamerCred, {Gold: 100}, 'jsclient test', (err, aBalance)->
			if err? then return done(err)
			aBalance.Gold.should.eql(100+(balance.Gold || 0))
			balance = aBalance
			done()

	it 'should reset Gold balance to 0', (done)->
		Clan.transactions.create gamerCred, {Gold: -balance.Gold, Silver: 1}, 'jsclient test', (err, aBalance)->
			if err? then return done(err)
			aBalance.Gold.should.eql(0)
			done()

	it 'should report an error if trying to withdraw too much', (done)->
		Clan.transactions.create gamerCred, {Gold: -1}, 'jsclient test', (err, aBalance)->
			err.status.should.eql(549)
			err.type.should.eql 'InvalidGamerTransaction'
			should(aBalance).be.undefined
			done()

	it 'should call history again', (done)->
		Clan.transactions.history gamerCred, (err, aHistory)->
			if err? then return done(err)
			aHistory.length.should.eql(history.length+2)
			history = aHistory
			done()

	it 'should call history with unit param too', (done)->
		Clan.transactions.history gamerCred, 'Silver', (err, aHistory)->
			if err? then return done(err)
			aHistory.length.should.be.lessThan(history.length)
			done()

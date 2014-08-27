should = require 'should'

Clan = require('../src/Clan.coffee')('cloudbuilder-key', 'azerty')

gamerCred = null

describe 'Clan JS client', ->

	it 'should allow log in', (done)->

		Clan.login 'anonymous', '536cf67b2a4d430000a6b9bf', 'a1b399f71c868faf0848c959ac6b290b6169750d', (err, gamer)->
			gamer.should.have.property('gamer_id')
			gamer.should.have.property('gamer_secret')
			gamerCred = Clan.createGamerCredentials(gamer)
			done()

	it 'should allow log out', (done)->
		Clan.logout gamerCred, (err)->
			should(err).be.eql(null)
			done()

	it 'should not allow log in with wrong credentials', (done)->

		Clan.login 'anonymous', '536cf67b2a4d430000a6b9bf', 'wrong a1b399f71c868faf0848c959ac6b290b6169750d', (err, gamer)->
			should(gamer).be.undefined
			err.should.have.property('status')
			err.status.should.eql(401)
			err.message.should.eql('Invalid user credentials')
			done()

	it 'should not allow log in with wrong credentials', (done)->

		Clan.login 'facebook', 'any will do', 'wrong FB token', (err, gamer)->
			should(gamer).be.undefined

			err.should.have.property('status')
			err.status.should.eql(401)
			err.message.should.eql('The received login token is invalid')
			done()

	it 'should accept Facebook credentials', (done)->

		Clan.login 'facebook', 'any will do', 'CAAIhTFZBxVNoBAK5477zCagnbO6ixr7Aj9rabZAMDfNvuqfKSaQpOHNRsfmjEdPrl7YhUwNvJEuaPp8O0zAGZAJZAlbvXL3XCGYB4BdDW5j5xV2gIn9go1AZBlIf1i0NRaM30q7hNhT1bpY8jFrtgpEWF1rtF1dVosfZCIiZCNdJjiVHBIjQc50yqyud8RIcn2mZC4zz9F1sZBhKnQ8sOyVX0KEmtXZAjMKKUZD', (err, gamer)->
			gamer.should.have.property 'gamer_id'
			gamer.should.have.property 'gamer_secret'
			done()


	it.skip 'should log in/out fast', (done)->
		this.timeout 100000
		fn = (cb)->
			Clan.login 'anonymous', '536cf67b2a4d430000a6b9bf', 'a1b399f71c868faf0848c959ac6b290b6169750d', (err, gamer)->
				if err? then return cb(err)
				gamer.should.have.property('gamer_id')
				gamer.should.have.property('gamer_secret')
				gamerCred = Clan.createGamerCredentials(gamer)

				Clan.logout gamerCred, (err)->
					cb(err)

		array = [1..200]

		counter = 0
		cb = (err)->
			if err? then console.log err
			counter++
			if counter == array.length then done()

		setInterval ->
			console.log "#{counter} / #{array.length}"
		, 1000

		fn(cb) for each in array

	it.skip 'should echo fast', (done)->
		this.timeout 100000
		fn = (cb)->
			Clan.echo (err)->
				if err? then return cb(err)
				Clan.echo (err)->
					if err? then return cb(err)
					else cb(null)

		array = [1..200]

		counter = 0
		cb = (err)->
			if err? then console.log err
			counter++
			if counter == array.length then done()

		setInterval ->
			console.log "#{counter} / #{array.length}"
		, 1000

		fn(cb) for each in array

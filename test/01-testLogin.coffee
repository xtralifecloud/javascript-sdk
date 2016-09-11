should = require 'should'

Clan = require('../src/Clan.coffee')('testgame-key', 'testgame-secret') # app credentials

dataset = require './0-dataset.json'

gamerCred = null
_gamer = null

describe 'Clan JS client', ->

	before 'setup', (done)->
		require('../src/endpoints.coffee').set 'sandbox'
		done()

	it 'should allow anonymous log in', (done)->

		Clan.login null, (err, gamer)->
			gamer.should.have.property('gamer_id')
			gamer.should.have.property('gamer_secret')

			gamerCred = Clan.createGamerCredentials(gamer)

			dataset.gamer_id = gamerCred.gamer_id
			dataset.gamer_token = gamerCred.gamer_secret

			Clan.login "anonymous", gamerCred.gamer_id, gamerCred.gamer_secret, (err, gamer)->
				if err? then done(err)
				gamer.should.have.property('gamer_id')
				gamer.should.have.property('gamer_secret')
				_gamer = gamer
				done()

	it 'should create a new friend', (done)->

		Clan.login null, (err, gamer)->
			gamer.should.have.property('gamer_id')
			gamer.should.have.property('gamer_secret')

			gamerCred = Clan.createGamerCredentials(gamer)

			dataset.friend_id = gamerCred.gamer_id
			dataset.friend_token = gamerCred.gamer_secret

			done()

	it 'should allow log out', (done)->
		Clan.withGamer(_gamer).logout (err)->
			should(err).be.eql(null)
			done()

	it 'should not allow log in with wrong credentials', (done)->

		Clan.login 'anonymous', dataset.gamer_id, 'wrong a1b399f71c868faf0848c959ac6b290b6169750d', (err, gamer)->
			should(gamer).be.undefined
			err.should.have.property('status')
			err.status.should.eql(401)
			err.response.body.message.should.eql('Invalid user credentials')
			done()

	it 'should not allow log in with wrong credentials', (done)->

		Clan.login 'facebook', 'any will do', 'wrong FB token', (err, gamer)->
			should(gamer).be.undefined

			err.should.have.property('status')
			err.status.should.eql(401)
			err.response.body.message.should.eql('The received login token is invalid')
			done()

	it.skip 'should accept Facebook credentials', (done)->
		# find a FB user access token at https://developers.facebook.com/tools/accesstoken/
		Clan.login 'facebook', 'any will do', 'CAAIhTFZBxVNoBAKEmRVDHiDcxhpTAZAaEAyGaxNJWxUBaSZC9E2QuZBqfcgjK1K8Ce4DAm1BRI897OB0kGB1hJaseP1JU7WEQFhteqwV63sKXZC5089tpMuDK1igEzrfeMtXpZBZBbZC4ebm9GRSujTCL8SZBFGAJmthltAfYvLXpoJlP7qdk2ZCStnsqQ4RRAIyhWmdZB8QDVZB29NeOyO73j9NnYBWz8F1ZCP4ZD', (err, gamer)->
			gamer.should.have.property 'gamer_id'
			gamer.should.have.property 'gamer_secret'
			done()

	it 'should allow conversion of anonymous to email', (done)->

		Clan.login null, (err, gamer)->
			gamerCred = Clan.createGamerCredentials(gamer)
			mail = "test" + Math.random() + "@localhost.localdomain"
			password = "password"

			Clan.withGamer(gamer).convertTo "email", mail, password, (err, result)->
				return done err if err?
				result.done.should.eql 1

				Clan.login 'email', mail, password, (err, result)->
					done(err)

	it.skip 'should log in/out fast', (done)->
		this.timeout 100000
		fn = (cb)->
			Clan.login 'anonymous', dataset.gamer_id, dataset.gamer_token, (err, gamer)->
				if err? then return cb(err)
				gamer.should.have.property('gamer_id')
				gamer.should.have.property('gamer_secret')
				gamerCred = Clan.createGamerCredentials(gamer)

				Clan.withGamer(gamer).logout (err)->
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

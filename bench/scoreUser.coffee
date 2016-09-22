assert = require 'assert'
Clan = require('../src/Clan.coffee')('testgame-key', 'testgame-secret', "http://163.172.170.255:2000")

q = require 'q'

# returns the number of ms in a second... and add some random noise
# one second can take from 750ms to 1250 ms
seconds = (s)->
	s * 750 + (s * 500 * Math.random() / 2)

self = module.exports =
	gamers: []

	doYourStuff: (index, cb)->

		doNtimes = (functions, n, cb)->
			return cb() if n is 0

			doIt functions, ->
				doNtimes functions, n-1, cb

		doIt = (api, cb)->
			lb = api.leaderboards()
			events = api.events('private')

			other = self.gamers[parseInt(self.gamers.length * Math.random())]
			events.sendVolatile other, {hello: "world #{parseInt(Math.random()*1000)}"}, (err, message) ->
				console.log err if err
				#console.log "message send to #{other}"
				#console.log message

			setTimeout cb, seconds(5)

			###
			setTimeout ->
				lb.set "sync", "hightolow", { score : 1000 * Math.random(), info : "using mickey"}, (err, res)->
					if err? then return console.error err
					cb()
			, seconds(15)
			###

		Clan.login null, (err, gamer)->
			if err? then return console.log err
			functions = Clan.withGamer(gamer)
			self.gamers.push gamer.gamer_id

			recv = ()->
				events = functions.events('private')

				events.receive 'auto', (err, message)->
					console.log "hello: #{message.hello}"
					setImmediate recv
			recv()

			doNtimes functions, 100, ->

				functions.logout (err)->
					if err? then return console.error err
					cb()


assert = require 'assert'
Clan = require('../src/Clan.coffee')('testgame-key', 'testgame-secret', "http://163.172.170.255:2000")

q = require 'q'

# returns the number of ms in a second... and add some random noise
# one second can take from 750ms to 1250 ms
seconds = (s)->
	s * 750 + (s * 500 * Math.random() / 2)

module.exports =
	doYourStuff: (index, cb)->

		doNtimes = (functions, n, cb)->
			return cb() if n is 0

			doIt functions, ->
				doNtimes functions, n-1, cb

		doIt = (functions, cb)->
			lb = functions.leaderboards()

			setTimeout ->
				lb.set "sync", "hightolow", { score : 1000 * Math.random(), info : "using mickey"}, (err, res)->
					if err? then return console.error err
					cb()
			, seconds(15)

		Clan.login null, (err, gamer)->
			if err? then return console.log err
			functions = Clan.withGamer(gamer)
			doNtimes functions, 100, ->

				functions.logout (err)->
					if err? then return console.error err
					cb()


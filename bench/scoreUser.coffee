assert = require 'assert'
Clan = require('../src/Clan.coffee')('testgame-key', 'testgame-secret')

q = require 'q'

# returns the number of ms in a second... and add some random noise
# one second can take from 750ms to 1250 ms
seconds = (s)->
	s * 750 + (s * 500 * Math.random() / 2)

module.exports =
	doYourStuff: (index, cb)->

		doNtimes = (functions, n, cb)->
			return cb() if n is 0

			doOnceIn30s functions, ->
				doNtimes functions, n-1, cb

		doOnceIn30s = (functions, cb)->
			vfs = functions.gamervfs(Clan.privateDomain)
			tx = functions.transactions(Clan.privateDomain)
			lb = functions.leaderboards()

			step1 = ->
				def = q.defer()
				#console.log "# set three keys now"
				vfs.set "test1", {hello: "world"}, (err, count)->
					if err? then console.error "1"
					if err? then return console.error err
					vfs.set "test2", {hello: "all"}, (err, count)->
						if err? then console.error "2"
						if err? then return console.error err
						vfs.set "test3", {hello: "mundo"}, (err, count)->
							if err? then console.error "3"
							if err? then return console.error err
							def.resolve()
				def.promise


			step2 = ->
				#console.log "# get 3 keys after 1s"
				def = q.defer()

				setTimeout ->
					vfs.get "test1", (err, data)->
						if err? then console.error "4"
						if err? then return console.error err
						vfs.get "test2", (err, data)->
							if err? then console.error "5"
							if err? then return console.error err
							vfs.get "test3", (err, data)->
								if err? then console.error "6"
								if err? then return console.error err
								def.resolve()
				, seconds(3)
				def.promise


			step3 = ->
				def = q.defer()
				#console.log "# send tx after 10s"
				setTimeout ->
					tx.create {Gold: 1}, 'bench', (err, aBalance)->
						if err? then return console.error err
						def.resolve()
				, seconds(7)
				def.promise


			step4 = ->
				#console.log "# get balance after 12s"
				def = q.defer()
				setTimeout ->
					tx.balance (err, aBalance)->
						if err? then return console.error err
						def.resolve()
				, seconds(2)
				def.promise


			step5 = ->
				def = q.defer()
				#console.log "# send tx after 14s and get 2 keys"
				setTimeout ->
					tx.create {Gold: 1}, 'bench', (err, aBalance)->
						if err? then return console.error err
						vfs.get "test1", (err, data)->
							if err? then console.error err.stack
							if err? then return console.error err

							vfs.get "test2", (err, data)->
								if err? then console.error err.stack
								if err? then return console.error err
								def.resolve()

				, seconds(2)
				def.promise


			step6 = ->
				def = q.defer()
				#console.log "# get balance after 15s"
				setTimeout ->

					tx.balance (err, aBalance)->
						if err? then return console.error err
						tx.create {Gold: 1}, 'bench', (err, aBalance)->
							if err? then return console.error err
							def.resolve()
				, seconds(1)
				def.promise


			step7 = ->
				def = q.defer()
				#console.log "# score in lb after 17s and set 1 key"
				setTimeout ->
					lb.set "level1", "hightolow", { score : seconds(100), info : "using mickey"}, (err, res)->
						if err? then return console.error err
						vfs.set "test1", {hello: "world"}, (err, count)->
							if err? then return console.error err
							def.resolve()
				, seconds(2)
				def.promise


			step8 = ->
				def = q.defer()
				#console.log "# get lb after 20s and get 2 keys"
				setTimeout ->
					lb.getHighscores "level1", 1, 10, (err, res)->
						if err? then return console.error err
						vfs.get "test1", (err, data)->
							if err? then console.error "8.1"
							if err? then return console.error err
							vfs.get "test2", (err, data)->
								if err? then console.error "8.2"
								if err? then return console.error err
								def.resolve()

				, seconds(3)
				def.promise

			step1()
			.then ->
				step2()
			.then ->
				step3()
			.then ->
				step4()
			.then ->
				step5()
			.then ->
				step6()
			.then ->
				step7()
			.then ->
				step8()
			.then ->
				cb()

		Clan.login null, (err, gamer)->
			if err? then return console.log err
			#console.log gamer
			console.log "starting cx "+index
			functions = Clan.withGamer(gamer)
			doNtimes functions, 10, ->

				functions.logout (err)->
					if err? then return console.error err
					cb()


assert = require 'assert'
Clan = require('../src/Clan.coffee')('testgame-key', 'testgame-secret')

# returns the number of ms in a second... and add some random noise
# one second can take from 750ms to 1250 ms
seconds = (s)->
	s * 750 + (s * 500 * Math.random() / 2)

module.exports =
	doYourStuff: (cb)->

		doNtimes = (creds, n, cb)->
			return cb() if n is 0

			doOnceIn30s creds, ->
				doNtimes creds, n-1, cb

		doOnceIn30s = (creds, cb)->
			vfs = Clan.gamervfs(Clan.privateDomain)
			tx = Clan.transactions(Clan.privateDomain)
			lb = Clan.leaderboards()

			# set three keys after 10ms
			setTimeout ->
				#console.log "step 1"
				vfs.set creds, "test1", {hello: "world"}, (err, count)->
					if err? then return console.error err
					vfs.set creds, "test2", {hello: "world"}, (err, count)->
						if err? then return console.error err
						vfs.set creds, "test3", {hello: "world"}, (err, count)->
							if err? then return console.error err
			,10

			# get 3 keys after 1s
			setTimeout ->
				#console.log "step 2"
				vfs.get creds, "test1", (err, data)->
					if err? then return console.error err
					vfs.get creds, "test2", (err, data)->
						if err? then return console.error err
						vfs.get creds, "test3", (err, data)->
							if err? then return console.error err
			, seconds(1)

			# send tx after 10s
			setTimeout ->
				#console.log "step 3"
				tx.create creds, {Gold: 1}, 'bench', (err, aBalance)->
					if err? then return console.error err
			, seconds(10)

			# get balance after 12s
			setTimeout ->
				#console.log "step 4"
				tx.balance creds, (err, aBalance)->
					if err? then return console.error err
			, seconds(12)

			# send tx after 14s and get 2 keys
			setTimeout ->
				#console.log "step 5"

				tx.create creds, {Gold: 1}, 'bench', (err, aBalance)->
					if err? then return console.error err
					vfs.get creds, "test1", (err, data)->
						if err? then return console.error err
						vfs.get creds, "test2", (err, data)->
							if err? then return console.error err
			, seconds(14)

			# get balance after 15s
			setTimeout ->
				#console.log "step 6"

				tx.balance creds, (err, aBalance)->
					if err? then return console.error err
					tx.create creds, {Gold: 1}, 'bench', (err, aBalance)->
						if err? then return console.error err
			, seconds(15)

			# score in lb after 17s and set 1 key
			setTimeout ->
				#console.log "step 7"
				lb.set creds, "level1", "hightolow", { score : seconds(100), info : "using mickey"}, (err, res)->
					if err? then return console.error err
					vfs.set creds, "test1", {hello: "world"}, (err, count)->
						if err? then return console.error err
			, seconds(17)

			# get lb after 20s and get 2 keys
			setTimeout ->
				#console.log "step 8"
				lb.getHighscores creds, "level1", 1, 10, (err, res)->
					if err? then return console.error err
					vfs.get creds, "test1", (err, data)->
						if err? then return console.error err
						vfs.get creds, "test2", (err, data)->
							if err? then return console.error err
			, seconds(20)

			setTimeout ->
				cb()
			, 30000

		Clan.login null, (err, gamer)->

			creds = Clan.createGamerCredentials(gamer)

			doNtimes creds, 10, ->

				Clan.logout creds, (err)->
					if err? then return console.error err
					cb()


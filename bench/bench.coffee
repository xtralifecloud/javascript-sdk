user = require './user.coffee'
async = require 'async'

howMany = 200

_each = (cb)->
	setTimeout ->
		user.doYourStuff ->
			howMany--
			console.log "#{howMany} to go"
			cb()
	, 30000*Math.random()

tasks = (_each for each in [1..howMany])

async.parallel tasks, (err)->
	if err? then console.error err
	console.log "done"
user = require './scoreUser.coffee'
async = require 'async'

howMany = 250

_each = (index)->
	(cb)->
		setTimeout ->
			user.doYourStuff index, ->
				howMany--
				console.log "#{howMany} to go"
				cb()
		, 60000*Math.random()

tasks = (_each(each) for each in [1..howMany])

async.parallel tasks, (err)->
	if err? then console.error err
	console.log "done"
agent = require 'superagent'
prefixer = require './prefixer.coffee'
ClanError = require './ClanError.coffee'

module.exports =  (appCredentials, gamerCred)->

	get: (cb)->
		agent
		.get "/v1/gamer/profile"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	set: (newProfile, cb)->
		unless key? then key=''
		agent
		.post "/v1/gamer/profile"
		.use prefixer
		.type 'json'
		.send newProfile
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

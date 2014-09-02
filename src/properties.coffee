agent = require 'superagent'
prefixer = require './prefixer.coffee'
ClanError = require './ClanError.coffee'

module.exports =  (appCredentials)->

	get: (gamerCred, key, cb)->
		unless key? then key=''
		agent
		.get "/v1/gamer/properties/#{key}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	set: (gamerCred, key, value, cb)->
		unless key? then key=''
		agent
		.post "/v1/gamer/properties/#{key}"
		.use prefixer
		.type 'json'
		.send { value : value }
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body
	
	delete: (gamerCred, key, cb)->
		unless key? then key=''
		agent
		.del "/v1/gamer/properties/#{key}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	load: (gamerCred, cb)->
		agent
		.get "/v1/gamer/properties"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	save: (gamerCred, data, cb)->
		agent
		.post "/v1/gamer/properties"
		.use prefixer
		.type 'json'
		.send data
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body
	
	remove: (gamerCred, cb)->
		agent
		.del "/v1/gamer/properties"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

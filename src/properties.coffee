agent = require 'superagent'
prefixer = require './prefixer.coffee'
ClanError = require './ClanError.coffee'

module.exports =  (appCredentials, gamerCred, domain)->

	get: (key, cb)->
		unless key? then key=''
		agent
		.get "/v2.6/gamer/property/#{domain}/#{key}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	set: (key, value, cb)->
		unless key? then key=''
		agent
		.post "/v2.6/gamer/property/#{domain}/#{key}"
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
	
	delete: (key, cb)->
		unless key? then key=''
		agent
		.del "/v2.6/gamer/property/#{domain}/#{key}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	load: (cb)->
		agent
		.get "/v2.6/gamer/property/#{domain}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	save: (data, cb)->
		agent
		.post "/v2.6/gamer/property/#{domain}"
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
	
	remove: (cb)->
		agent
		.del "/v2.6/gamer/property/#{domain}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	find : (target, cb)->
		agent
		.get "/v2.6/gamer/matchproperties/#{domain}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.send target
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body


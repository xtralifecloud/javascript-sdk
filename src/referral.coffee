agent = require 'superagent'
prefixer = require './prefixer.coffee'
ClanError = require './ClanError.coffee'

module.exports =  (appCredentials, gamerCred, domain)->

	getCode: (cb)->
		agent
		.put "/v2.6/gamer/godfather/#{domain}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	useCode: (godfather, reward, cb)->
		agent
		.post "/v2.6/gamer/godfather/#{domain}"
		.use prefixer
		.set appCredentials
        .send { godfather, reward }
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	getGodfather: (cb)->
		agent
		.get "/v2.6/gamer/godfather/#{domain}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	getGodchildren: (cb)->
		agent
		.get "/v2.6/gamer/godchildren/#{domain}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body
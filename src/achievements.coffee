agent = require 'superagent'
prefixer = require './prefixer.coffee'
ClanError = require './ClanError.coffee'

module.exports =  (appCredentials, gamerCred, domain)->

	list: (cb)->
		agent
		.get "/v1/gamer/achievements/#{domain}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	associateData: (name, data, cb)->
		agent
		.post "/v1/gamer/achievements/#{domain}/#{name}/gamerdata"
		.use prefixer
		.set appCredentials
		.send data
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

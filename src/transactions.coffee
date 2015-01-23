agent = require 'superagent'
prefixer = require './prefixer.coffee'
ClanError = require './ClanError.coffee'

module.exports = (appCredentials, gamerCred, domain)->
	balance: (cb)->
		agent
		.get "/v1/gamer/tx/#{domain}/balance"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	create: (tx, desc, cb)->
		agent
		.post "/v2.2/gamer/tx/#{domain}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.send {transaction: tx, description: desc}
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	history: (unit=null, skip, limit, cb)->
		options = {skip, limit}
		if unit? then options.unit = unit

		agent
		.get "/v2.4/gamer/tx/#{domain}"
		.use prefixer
		.query options
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

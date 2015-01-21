agent = require 'superagent'
prefixer = require './prefixer.coffee'
ClanError = require './ClanError.coffee'

module.exports = (appCredentials, gamerCred, domain, keepaliveAgent)->
	balance: (cb)->
		agent
		.get "/v1/gamer/tx/#{domain}/balance"
		.agent keepaliveAgent
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
		.post "/v1/gamer/tx/#{domain}"
		.agent keepaliveAgent
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.send {transaction: tx, description: desc}
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	history: (unit, cb)->
		options = {}
		unless cb? then cb = unit else options = {unit}

		agent
		.get "/v1/gamer/tx/#{domain}"
		.agent keepaliveAgent
		.use prefixer
		.query options
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

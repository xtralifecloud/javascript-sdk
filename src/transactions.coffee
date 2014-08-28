agent = require 'superagent'
prefixer = require './prefixer.coffee'
ClanError = require './ClanError.coffee'

module.exports = (appCredentials)->
	balance: (gamerCred, cb)->
		agent
		.get '/v1/gamer/tx/balance'
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	create: (gamerCred, tx, desc, cb)->
		agent
		.post '/v1/gamer/tx'
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.send {transaction: tx, description: desc}
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	history: (gamerCred, unit, cb)->
		options = {}
		unless cb? then cb = unit else options = {unit}

		agent
		.get '/v1/gamer/tx'
		.use prefixer
		.query options
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

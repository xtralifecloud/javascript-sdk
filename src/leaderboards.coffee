agent = require 'superagent'
prefixer = require './prefixer.coffee'
ClanError = require './ClanError.coffee'

module.exports =  (appCredentials)->

	set: (gamerCred, board, order, score, cb)->
		agent
		.post "/v1/gamer/scores/#{board}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.send score
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body
			else cb null, res.body

	get: (gamerCred, cb)->
		agent
		.get "/v1/gamer/bestscores"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body
			else cb null, res.body

	getHighscores: (gamerCred, board, order, page, count, cb)->
		agent
		.get "/v1/gamer/scores/#{board}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body
			else cb null, res.body

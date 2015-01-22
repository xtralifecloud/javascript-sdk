agent = require 'superagent'
prefixer = require './prefixer.coffee'
ClanError = require './ClanError.coffee'

module.exports =  (appCredentials, gamerCred)->

	set: (board, order, score, cb)->
		agent
		.post "/v1/gamer/scores/#{board}?order=#{order}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.send score
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body else cb null, res.body

	get: (cb)->
		agent
		.get "/v1/gamer/bestscores"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body else cb null, res.body

	getHighscores: (board, page, count, cb)->
		agent
		.get "/v1/gamer/scores/#{board}?page=#{page}&count=#{count}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body else cb null, res.body

agent = require 'superagent'
prefixer = require './prefixer.coffee'
ClanError = require './ClanError.coffee'

module.exports =  (appCredentials, gamerCred, domain)->

	post: (score, board, order, info, force, cb)->
		agent
		.post "/v2.6/gamer/scores/#{domain}/#{board}?order=#{order}&force=#{force}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.send { score, info }
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body else cb null, res.body

	getRank: (score, board, cb)->
		agent
		.put "/v2.6/gamer/scores/#{domain}/#{board}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.send score
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body else cb null, res.body

	set: (board, order, score, cb)->
		agent
		.post "/v2.6/gamer/scores/#{domain}/#{board}?order=#{order}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.send score
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body else cb null, res.body

	get: (cb)->
		agent
		.get "/v2.6/gamer/bestscores/#{domain}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body else cb null, res.body

	getHighscores: (board, page, count, cb)->
		agent
		.get "/v2.6/gamer/scores/#{domain}/#{board}?page=#{page}&count=#{count}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body else cb null, res.body

	getFriendsHighscores: (board, page, count, cb)->
		agent
		.get "/v2.6/gamer/scores/#{domain}/#{board}?page=#{page}&count=#{count}&type=friendscore"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body else cb null, res.body

	getCenteredHighscores: (board, count, cb)->
		agent
		.get "/v2.6/gamer/scores/#{domain}/#{board}?page=me&count=#{count}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body else cb null, res.body

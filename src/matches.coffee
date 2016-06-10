agent = require 'superagent'
prefixer = require './prefixer.coffee'
ClanError = require './ClanError.coffee'

module.exports =  (appCredentials, gamerCred, domain)->

	list: (properties, options=null, cb)->
		unless cb?
			cb = options
			options = null

		queryoptions = "&properties=#{JSON.stringify(properties)}"
		queryoptions += "&full" if options?.full?
		queryoptions += "&participating" if options?.participating?
		queryoptions += "&finished" if options?.finished?
		queryoptions += "&invited" if options?.invited?
		queryoptions += "&skip=#{options.skip}" if options?.skip?
		queryoptions += "&limit=#{options.limit}" if options?.limit?

		agent
		.get "/v1/gamer/matches?domain=#{domain}#{queryoptions}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body else cb null, res.body


	create: (matchData, cb)->
		agent
		.post "/v1/gamer/matches?domain=#{domain}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.type 'json'
		.send matchData
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body else cb null, res.body

	get: (matchID, cb)->
		agent
		.get "/v1/gamer/matches/#{matchID}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body else cb null, res.body


	del: (matchID, cb)->
		agent
		.del "/v1/gamer/matches/#{matchID}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body else cb null, res.body


	join: (matchID, osn, cb)->
		agent
		.post "/v1/gamer/matches/#{matchID}/join"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.type 'json'
		.send osn
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body else cb null, res.body


	leave: (matchID, osn, cb)->
		agent
		.post "/v1/gamer/matches/#{matchID}/leave"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.type 'json'
		.send osn
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body else cb null, res.body

	invite: (matchID, friendID, osn, cb)->
		agent
		.post "/v1/gamer/matches/#{matchID}/invite/#{friendID}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.type 'json'
		.send osn
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body else cb null, res.body

	dismiss: (matchID, cb)->
		agent
		.del "/v1/gamer/matches/#{matchID}/invitation"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body else cb null, res.body


	move: (matchID, lastEventID, move, cb)->
		agent
		.post "/v1/gamer/matches/#{matchID}/move?lastEventId=#{lastEventID}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.type 'json'
		.send move
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body else cb null, res.body

	finish: (matchID, lastEventID, osn, cb)->
		agent
		.post "/v1/gamer/matches/#{matchID}/finish?lastEventId=#{lastEventID}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.type 'json'
		.send osn
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body else cb null, res.body

	draw: (matchID, lastEventID, count, osn, cb)->
		agent
		.post "/v1/gamer/matches/#{matchID}/shoe/draw?lastEventId=#{lastEventID}&count=#{count}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.type 'json'
		.send osn
		.end (err, res)->
			if err? then return cb(err)
			if res.error then cb new ClanError res.status, res.body else cb null, res.body

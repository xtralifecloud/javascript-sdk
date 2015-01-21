agent = require 'superagent'
unless agent.Request.prototype.use?
	agent.Request.prototype.use = (fn)->
		fn(@)
		@

Agent = require('agentkeepalive') #.HttpsAgent
prefixer = require './prefixer.coffee'
ClanError = require './ClanError.coffee'

# TODO no keepaliveagent in browser
keepaliveAgent = new Agent
	maxSockets: 500,
	maxFreeSockets: 10,
	timeout: 60000,
	keepAliveTimeout: 30000

Clan = module.exports = (apikey, apisecret)->

	appCredentials = {'x-apikey': apikey, 'x-apisecret': apisecret}

	createGamerCredentials: (gamer)->
		{gamer_id: gamer.gamer_id, gamer_secret: gamer.gamer_secret}

	login: (network, id, secret, cb)->
		if network?
			agent
			.post '/v1/login'
			.agent keepaliveAgent
			.use prefixer
			.send {network, id, secret}
			.set appCredentials
			.end (err, res)->
				if err? then cb(err)
				else
					if res.error then cb new ClanError res.status, res.body
					else cb null, res.body, false
		else
			cb = id
			agent
			.post '/v1/login/anonymous'
			.agent keepaliveAgent
			.use prefixer
			.set appCredentials
			.end (err, res)->
				if err? then cb(err)
				else
					if res.error then cb new ClanError res.status, res.body
					else cb null, res.body, true

	echo: (cb)->
		agent
		.get '/echo/index.html'
		.agent keepaliveAgent
		.use prefixer
		.end (err, res)->
			cb(err)

	withGamer: (gamer)->
		creds = this.createGamerCredentials gamer

		transactions: (domain)->
			require('./transactions.coffee')(appCredentials, creds, domain, keepaliveAgent)

		gamervfs: (domain)->
			require('./gamervfs.coffee')(appCredentials, creds, domain, keepaliveAgent)

		friends: ()->
			require('./friends.coffee')(appCredentials, creds, keepaliveAgent)

		properties: ()->
			require('./properties.coffee')(appCredentials, creds, keepaliveAgent)

		leaderboards: ()->
			require('./leaderboards.coffee')(appCredentials, creds, keepaliveAgent)

		events: (domain)->
			require('./event.coffee')(appCredentials, creds, domain, keepaliveAgent)

		logout: (cb)->
			agent
			.post '/v1/gamer/logout'
			.agent keepaliveAgent
			.use prefixer
			.set appCredentials
			.auth creds.gamer_id, creds.gamer_secret
			.end (err, res)->
				if err? then cb(err)
				else
					if res.error then cb new ClanError res.status, res.body
					else cb null, res.body

	privateDomain: 'private'

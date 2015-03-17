agent = require 'superagent'
unless agent.Request.prototype.use?
	agent.Request.prototype.use = (fn)->
		fn(@)
		@

prefixer = require './prefixer.coffee'
ClanError = require './ClanError.coffee'

Clan = module.exports = (apikey, apisecret)->

	appCredentials = {'x-apikey': apikey, 'x-apisecret': apisecret}

	createGamerCredentials: (gamer)->
		{gamer_id: gamer.gamer_id, gamer_secret: gamer.gamer_secret}

	login: (network, id, secret, cb)->

		if network?
			agent
			.post '/v1/login'
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
		.use prefixer
		.end (err, res)->
			cb(err)

	withGamer: (gamer)->
		creds = this.createGamerCredentials gamer

		transactions: (domain='private')->
			require('./transactions.coffee')(appCredentials, creds, domain)

		gamervfs: (domain='private')->
			require('./gamervfs.coffee')(appCredentials, creds, domain)

		friends: (domain='private')->
			require('./friends.coffee')(appCredentials, creds, domain)

		profile: ()->
			require('./profile.coffee')(appCredentials, creds)

		properties: (domain='private')->
			require('./properties.coffee')(appCredentials, creds, domain)

		leaderboards: (domain='private')->
			require('./leaderboards.coffee')(appCredentials, creds, domain)

		events: (domain)->
			require('./event.coffee')(appCredentials, creds, domain)

		logout: (cb)->
			agent
			.post '/v1/gamer/logout'
			.use prefixer
			.set appCredentials
			.auth creds.gamer_id, creds.gamer_secret
			.end (err, res)->
				if err? then cb(err)
				else
					if res.error then cb new ClanError res.status, res.body
					else cb null, res.body

	privateDomain: 'private'

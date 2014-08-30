agent = require 'superagent'
unless agent.Request.prototype.use?
	agent.Request.prototype.use = (fn)->
		fn(@)
		@

prefixer = require './prefixer.coffee'
ClanError = require './ClanError.coffee'

module.exports = (apikey, apisecret)->

	appCredentials = {'x-apikey': apikey, 'x-apisecret': apisecret}

	_auth = (request)->
		request.set 'x-apikey', apikey
		request.set 'x-apisecret', apisecret
		request

	createGamerCredentials: (gamer)->
		{gamer_id: gamer.gamer_id, gamer_secret: gamer.gamer_secret}

	login: (network, id, secret, cb)->
		agent
		.post '/v1/gamer/login'
		.use prefixer
		.send {network, id, secret}
		.set appCredentials
		.end (err, res)->
			created = res.status is 201
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body, created

	logout: (gamerCred, cb)->
		agent
		.post '/v1/gamer/logout'
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	echo: (cb)->
		agent
		.get '/echo/index.html'
		.use prefixer
		.end (err, res)->
			cb(err)


	transactions: (domain)->
		require('./transactions.coffee')(appCredentials, domain)

	gamervfs: (domain)->
		require('./gamervfs.coffee')(appCredentials, domain)

	privateDomain: 'private'

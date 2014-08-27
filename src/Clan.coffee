agent = require 'superagent'

class ClanError extends Error
	constructor: (@status, @response)->
		@message = @response.message
		@type = @response.type

module.exports = (apikey, apisecret)->

	_auth = (request)->
		request.set 'x-apikey', apikey
		request.set 'x-apisecret', apisecret
		request

	createGamerCredentials: (gamer)->
		{gamer_id: gamer.gamer_id, gamer_secret: gamer.gamer_secret}

	login: (network, id, secret, cb)->
		agent
		.post 'https://sandbox-api01.clanofthecloud.mobi/v1/gamer/login'
		.send {network, id, secret}
		.set 'x-apikey', apikey
		.set 'x-apisecret', apisecret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.status is 200 or res.status is 201
					cb null, res.body
				else
					cb new ClanError res.status, res.body

	logout: (gamerCred, cb)->
		agent
		.post 'https://sandbox-api01.clanofthecloud.mobi/v1/gamer/logout'
		.set 'x-apikey', apikey
		.set 'x-apisecret', apisecret
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.status is 200
					cb null, res.body
				else
					cb new ClanError res.status, res.body

	echo: (cb)->
		agent
		.get 'https://sandbox-api01.clanofthecloud.mobi/echo/index.html'
		.end (err, res)->
			cb(err)


	transactions: require('./transactions.coffee')(apikey, apisecret, agent, ClanError)

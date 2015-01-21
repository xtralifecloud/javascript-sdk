agent = require 'superagent'
prefixer = require './prefixer.coffee'
ClanError = require './ClanError.coffee'

_timeout = 50000

module.exports = (appCredentials, gamerCred, domain)->

	setTimeout: (timeout)->
		_timeout = timeout

	send: (gamer_id, message, cb)->
		agent
		.post "/v1/gamer/event/#{domain}/#{gamer_id}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.send message
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	# cb(null, null) if no message is received before timeout
	receive: (ack='auto', cb)->
		unless cb?
			cb = ack
			ack = 'auto'
		agent
		.get "/v1/gamer/event/#{domain}?ack=#{ack}&timeout=#{_timeout}"
		.use prefixer
		.set appCredentials
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else
					if res.status is 204 then cb null, null
					else cb null, res.body

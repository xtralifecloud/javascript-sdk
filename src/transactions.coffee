module.exports = (apikey, apisecret, agent, ClanError)->
	balance: (gamerCred, cb)->
		agent
		.get 'https://sandbox-api01.clanofthecloud.mobi/v1/gamer/tx/balance'
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

	create: (gamerCred, tx, desc, cb)->
		agent
		.post 'https://sandbox-api01.clanofthecloud.mobi/v1/gamer/tx'
		.set 'x-apikey', apikey
		.set 'x-apisecret', apisecret
		.auth gamerCred.gamer_id, gamerCred.gamer_secret
		.send {transaction: tx, description: desc}
		.end (err, res)->
			if err? then cb(err)
			else
				if res.status is 200
					cb null, res.body
				else
					cb new ClanError res.status, res.body

	history: (gamerCred, unit, cb)->
		url = 'https://sandbox-api01.clanofthecloud.mobi/v1/gamer/tx'
		unless cb?
			cb = unit
		else
			url += "?unit=#{unit}"

		agent
		.get url
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

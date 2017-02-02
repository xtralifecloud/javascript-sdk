agent = require 'superagent'
prefixer = require './prefixer.coffee'
ClanError = require './ClanError.coffee'

module.exports =  (appCredentials, domain)->

	get: (key, cb)->
		unless key? then key=''
		agent
		.get "/v1/vfs/#{domain}/#{key}"
		.use prefixer
		.set appCredentials
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	getValue: (key, cb)->
		unless key? then key=''
		agent
		.get "/v3.0/vfs/#{domain}/#{key}"
		.use prefixer
		.set appCredentials
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

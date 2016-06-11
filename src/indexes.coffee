agent = require 'superagent'
prefixer = require './prefixer.coffee'
ClanError = require './ClanError.coffee'

module.exports =  (appCredentials, domain)->

	set: (indexName, id, properties, payload, cb)->
		index = 
			id : id
			properties : properties
			payload : payload
		agent
		.post "/v1/index/#{domain}/#{indexName}"
		.use prefixer
		.set appCredentials
		.type 'json'
		.send index
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	get: (indexName, id, cb)->
		agent
		.get "/v1/index/#{domain}/#{indexName}/#{id}"
		.use prefixer
		.set appCredentials
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	del: (indexName, id, cb)->
		agent
		.delete "/v1/index/#{domain}/#{indexName}/#{id}"
		.use prefixer
		.set appCredentials
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body


	search: (indexName, q, sort, skip, limit, cb)->
		query = "?q=#{q}"
		query += "&from=#{skip}" if skip?
		query += "&max=#{limit}" if limit?
		query += "&sort=#{sort}" if sort?
		agent
		.post "/v1/index/#{domain}/#{indexName}/search#{query}"
		.use prefixer
		.set appCredentials
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body

	query: (indexName, query, skip, limit, cb)->
		param = "?from=#{if skip? then Number(skip) else 0}"
		param += "&max=#{limit}" if limit?
		agent
		.post "/v1/index/#{domain}/#{indexName}/search#{param}"
		.use prefixer
		.set appCredentials
		.type 'json'
		.send query
		.end (err, res)->
			if err? then cb(err)
			else
				if res.error then cb new ClanError res.status, res.body
				else cb null, res.body



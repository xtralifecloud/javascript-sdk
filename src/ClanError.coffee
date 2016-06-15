endpoints = require "./endpoints.coffee"

class ClanError extends Error
	constructor: (@status, @response)->
		@message = @response.message
		@type = @response.type
		@name = @response.name
		if @status < 100 or (@status >= 300 and @status < 400) or @status >= 500
			endpoints.tryOther()

module.exports = ClanError
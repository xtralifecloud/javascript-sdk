class ClanError extends Error
	constructor: (@status, @response)->
		@message = @response.message
		@type = @response.type
		@name = @response.name

module.exports = ClanError
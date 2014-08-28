class ClanError extends Error
	constructor: (@status, @response)->
		@message = @response.message
		@type = @response.type

module.exports = ClanError
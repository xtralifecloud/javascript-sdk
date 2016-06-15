
Endpoints = require './endpoints.coffee'

module.exports = (request)->
	request.url = Endpoints.current()+request.url
	request

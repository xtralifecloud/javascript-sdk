#Agent = require('agentkeepalive') #.HttpsAgent
#keepaliveAgent = new Agent
#	maxSockets: 500,
#	maxFreeSockets: 10,
#	timeout: 60000,
#	keepAliveTimeout: 30000

module.exports = (request)->
	#request.url = 'https://sandbox-api01.clanofthecloud.mobi'+request.url

	#request.url = 'http://localhost:2000'+request.url
	request.url = 'http://195.154.227.44:8000'+request.url

	# not required in browsers
	#request.agent keepaliveAgent
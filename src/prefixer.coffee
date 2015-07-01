Agent = require('agentkeepalive').HttpsAgent
keepAliveAgent = new Agent
	maxSockets: 50,
	maxFreeSockets: 0,
	timeout: 600000,
	keepAliveTimeout: 600000

#https = require('https');
#keepAliveAgent = new https.Agent({ keepAlive: true, maxSockets: 30, maxFreeSockets: 30, keepAliveMsecs: 1000 });

module.exports = (request)->
	#request.url = 'https://prod-api01.clanofthecloud.mobi'+request.url
	request.url = 'https://sandbox-api01.clanofthecloud.mobi'+request.url

	#request.url = 'http://localhost:2000'+request.url
	#request.url = 'http://195.154.227.44:8000'+request.url

	# not required in browsers
	#request.agent keepAliveAgent
	request

#https.globalAgent = keepAliveAgent
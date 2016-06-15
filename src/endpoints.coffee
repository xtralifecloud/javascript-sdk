
endpoints = 
	url: "https://sandbox-api01.clanofthecloud.mobi"

	current: #default is sandbox
		url: 'https://sandbox-api[id].clanofthecloud.mobi'
		count: 2

	sandbox: 
		url: 'https://sandbox-api[id].clanofthecloud.mobi'
		count: 2

	prod:
		url: 'https://prod-api[id].clanofthecloud.mobi'
		count: 16


module.exports = 

	set : (endpoint)->
		if endpoint == "sandbox"
			endpoints.current = endpoints.sandbox
		else if endpoint == "prod"
			endpoints.current = endpoints.prod
		else if typeof(endpoint) == 'string' and endpoint!=""
			endpoints.url = endpoint
			endpoints.count = 1

	current : ->
		return endpoints.url if endpoints.url?
		@tryOther

	tryOther : ->
		if endpoints.current.url.indexOf("[id]")!=-1
			endpoints.url = endpoints.current.url.replace("[id]", ("0"+Math.floor((Math.random() * endpoints.current.count) + 1)).slice(-2))
			console.log "new url : #{endpoints.url}"


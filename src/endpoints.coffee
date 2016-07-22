
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

	dev:
		url: 'http://localhost:2000'
		count: 1

module.exports = 

	set : (endpoint)->
		if endpoint == "sandbox"
			endpoints.current = endpoints.sandbox
		else if endpoint == "prod"
			endpoints.current = endpoints.prod
		else if endpoint == "dev"
			endpoints.current = endpoints.dev
		else if typeof(endpoint) == 'string' and endpoint!=""
			endpoints.current = {url: endpoint, count:1}
		else throw new Error("endpoint must be either dev|sandbox|prod or an url")

		endpoints.url = endpoints.current.url
		@tryOther()

	current : ->
		return endpoints.url if endpoints.url?
		@tryOther
		endpoints.url

	tryOther : ->
		if endpoints.current.url.indexOf("[id]")!=-1
			endpoints.url = endpoints.current.url.replace("[id]", ("0"+Math.floor((Math.random() * endpoints.current.count) + 1)).slice(-2))
			console.log "new url : #{endpoints.url}"


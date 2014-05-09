crypto = require "crypto"
request = require "request"
async = require "async"

class apiClient
	constructor: (@endpoints, @apikey, @apisecret, @delayretry)->
		@delayretry = [400, 800, 1600, 3200, 6400, 12800, 25600] if not @delayretry?

	signUrl: (url, secret)->
		hmac = crypto.createHmac 'sha256', secret
		hmac.update url
		hmac.digest 'base64'

	signPassword: (val, secret)->
		cipher = crypto.createCipher 'aes-256-cbc', secret
		coded = cipher.update val, 'utf8', 'base64'
		coded += cipher.final 'base64'
		coded

	decodeBody: (val, secret)->
		decipher = crypto.createDecipher 'aes-256-cbc', secret
		decoded = decipher.update val, 'base64', 'utf8'
		decoded += decipher.final 'utf8'
		decoded

	encodeBody: (val, secret)->
		cipher = crypto.createCipher 'aes-256-cbc', secret
		encoded = cipher.update val, 'utf8', 'base64'
		encoded += cipher.final 'base64'
		encoded

	retry_lb: (lbaddr, options, cb)->
		lb = 0 		
		async.doWhilst  (localcb)=>
			options.url = "http://"+lbaddr[0] + options.baseurl
			request options, (err, resp, body)=>
				if (lb+1>=lbaddr.length) or (err? and err.code!='ECONNREFUSED') or (resp? and resp.statusCode!=502)
					return cb err, resp, body
				console.log "try next lb instance..."
				lbaddr.push lbaddr.shift()
				localcb()
		, ()->
			++lb
		, (err)->

	retry_onerror: (lbaddr, attempt, options, cb)->
		that = this
		@retry_lb lbaddr, options, (err, resp, body)->
			return cb(err, resp, body) if not err? or attempt >= that.delayretry.length

			console.log "timeout in #{that.delayretry[attempt]}"
			setTimeout ()->
				that.retry_onerror lbaddr, ++attempt, options, cb
			, that.delayretry[attempt]

	auth: (@userId, @accessToken)->

	call: (url, data, cb)->

		options =
			headers:
				sdkversion: '10'
				nonce: new Date().toJSON()
				apikey: @apikey
			baseurl: url
			method: "POST"

		if data?
			options.body = @encodeBody JSON.stringify(data), @apisecret
		
		checkurl = url
		checkurl += @apikey
		checkurl += options.headers.nonce
		checkurl += @userId if @userId?
		checkurl += @accessToken if @accessToken?

		options.headers.apisign = @signUrl checkurl, @apisecret
				
		if @userId?
			options.headers.authuser = @userId
			options.headers.authtoken = @accessToken

		@retry_onerror @endpoints,  0, options, (err, resp, body)=>
			body = @decodeBody body, @apisecret if body? and resp?.statusCode==200
			try
				body = JSON.parse body
			catch ex
			cb err, resp, body


module.exports.client = apiClient

module.exports.loadbalancers = [
	"sandbox-lb01.clanofthecloud.mobi:2000"
	"sandbox-lb02.clanofthecloud.mobi:2000"
	]


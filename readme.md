# jsclient helps to connect to clan of the cloud services

jsclient manage the request to the servers, it take care of loadbalancing and has a retry mechanism.

## How to use jsclient

You need to create a new object by passing it the endpoints and your credentials:

	API = require "jsclient"
	client = new API.client endoints, apikey, apisecret

where endpoints must be an array of server addresses, the default values are:

	endpoints = API.loadbalancers


Now, when you want to make a call, just type:

	client.call "url", options, (err, resp, body)->

where `url` is an entry point of the api, `options` the paramters requested by this api method, and `body` is the result of the method.
you need to test `err` and the `resp.statusCode`, to know the status of the operation. 

When you call a restricted url (logged user) you should authenticate with:

	client.auth user, password

before any call to client.call



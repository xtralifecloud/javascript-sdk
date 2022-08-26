// What to do after login result
Sample.prototype.LoginDone = function(error, gamer)
{
	// This is the callback we use to call after we get login results in this sample
	// Just do what you please here; Show a welcome message, load more gamer data, redirect to another page...
	if (error)
		ConsoleLog("Login error: " + JSON.stringify(error));
	else
		ConsoleLog("Login succeeded (gamerID: " + gamer.gamer_id + ")");
}

// Triggers an anonymous login (without credentials)
Sample.prototype.LoginAnonymously = function(options, whenDone)
{
	this.clan.login(null, null, options, function(error, gamer)
	{
		// Store credentials for later use if no error occured; This will set BasicAuthentication on future requests
		if (!error)
		{
			this.gamerData = gamer;
			this.storageManager.SetData("gamer", JSON.stringify(gamer));
		}
		
		this.LoggedInHeaderDisplay();
		this.LoggedInBodyDisplay();
		this.LoggedInCheck();
		
		// Callback
		if (whenDone)
			whenDone(error, gamer);
	}.bind(this));
};

///////////
Sample.prototype.Login = function(whenDone)
{
	// Create the credentials JSON according to the chosen network
	var network = document.getElementById("network").value;
	if (network == "gamecenter") {
		credentials = {
			"id": document.getElementById('idGCVal').value,
			"publicKeyUrl": document.getElementById('pkGCVal').value,
			"signature": document.getElementById('signatureGCVal').value,
			"salt": document.getElementById('saltGCVal').value,
			"timestamp": document.getElementById('timestampGCVal').value,
			"bundleId": document.getElementById('bundleGCVal').value
		}
	} else if (network == "anonymous" || network == "email") {
		credentials = {
			id: document.getElementById('gamerIdVal').value,
			secret: document.getElementById('gamerSecretVal').value
		}
	} else {
		credentials = {
			auth_token: document.getElementById('authTokenVal').value
		}
	}

	// Create an "options" object depending on whether you have chosen to enter the OS and the token of the device
	var options;
	if (document.getElementById('osnPlatform').value != '' && document.getElementById('osnToken').value != '') {
		options = { deviceToken: {
			os: document.getElementById('osnPlatform').value,
			token: document.getElementById('osnToken').value
		   }}
	}
		this.clan.login(network, credentials, options, function(error, gamer)
	{
		// Store credentials for later use if no error occured; This will set BasicAuthentication on future requests
		if (!error)
		{
			this.gamerData = gamer;
			this.storageManager.SetData("gamer", JSON.stringify(gamer));
		}
		
		this.LoggedInHeaderDisplay();
		this.LoggedInBodyDisplay();
		this.LoggedInCheck();
		
		// Callback
		if (whenDone)
			whenDone(error, gamer);
	}.bind(this));
};

Sample.prototype.convert = function(whenDone)
{

	var network = document.getElementById("network").value;
	if (network == "gamecenter") {
		credentials = {
			"id": document.getElementById('idGCVal').value,
			"publicKeyUrl": document.getElementById('pkGCVal').value,
			"signature": document.getElementById('signatureGCVal').value,
			"salt": document.getElementById('saltGCVal').value,
			"timestamp": document.getElementById('timestampGCVal').value,
			"bundleId": document.getElementById('bundleGCVal').value
		}
	} else if (network == "anonymous" || network == "email") {
		credentials = {
			id: document.getElementById('gamerIdVal').value,
			secret: document.getElementById('gamerSecretVal').value
		}
	} else {
		credentials = {
			auth_token: document.getElementById('authTokenVal').value
		}
	}

	if (this.gamerData)
	{
		this.clan.withGamer(this.gamerData).convertTo(network, credentials, function(error, gamer, gamerData)
		{
			if (error)
				ConsoleLog("Convert error: " + JSON.stringify(error));
			else
				ConsoleLog(`Gamer ${gamer.gamer.gamer_id} successfully converted to ${network} (${credentials.id}) !`)
		})
	}
	else{
		ConsoleLog("You need to be logged in to convert your account.")
	};
	if (whenDone)
			whenDone(error, gamer);
};


// Logout current logged in gamer by deleting his login data
Sample.prototype.Logout = function()
{
	if (this.gamerData)
	{
		// You may call this logout method too, but this is not mandatory
		this.clan.withGamer(this.gamerData).logout(function(error, result)
		{
			if (error)
				ConsoleLog("Logout error: " + error);
		});
		
		// Delete the gamerData in our sample to consider we are logged out
		this.gamerData = null;
		this.storageManager.DeleteData("gamer");
		this.LoggedInHeaderDisplay();
		this.LoggedInBodyDisplay();
		this.LoggedInCheck();
	}
	else
		ConsoleLog("Logout error: No gamer data found; You're probably already logged out");
}

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
Sample.prototype.LoginAnonymously = function(whenDone)
{
	this.clan.login(null, function(error, gamer)
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

// Triggers a facebook login (without credentials)
Sample.prototype.LoginFacebook = function(whenDone)
{
	var self = this;
	
	// Login into Facebook and XtraLife's Facebook App
	facebook.FacebookAppLogin(function(facebookAccessToken)
	{
		// Login into XtraLife with Facebook token once logged in into Facebook and XtraLife's Facebook App
		if (facebookAccessToken)
		{
			// We use access token from Facebook login to log into XtraLife
			self.clan.login("facebook", "", facebookAccessToken, function(error, gamer)
			{
				// Store credentials for later use if no error occured; This will set BasicAuthentication on future requests
				if (!error)
				{
					self.gamerData = gamer;
					self.storageManager.SetData("gamer", JSON.stringify(gamer));
				}
				
				self.LoggedInHeaderDisplay();
				self.LoggedInBodyDisplay();
				self.LoggedInCheck();
				
				// Callback
				if (whenDone)
					whenDone(error, gamer);
			}.bind(self));
		}
		else
			ConsoleLog("Could not retrieve Facebook login token; User is probably not logged into Facebook or XtraLife's Facebook App");
	});
};

// Triggers a login with credentials (gamerId and gamerSecret)
Sample.prototype.LoginWithCredentials = function(gamerId, gamerSecret, whenDone)
{
	// With credentials, the login network type have to be "anonymous", wether you want to log in with an Anonymous or a Facebook network type XtraLife account
	this.clan.resumeSession(gamerId, gamerSecret, function(error, gamer)
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

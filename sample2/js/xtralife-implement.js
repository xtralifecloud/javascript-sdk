/*----------------*/
/* Initialization */
/*----------------*/

// Ensures there is only one xtralife instance
window.xtralife = window.xtralife || {};

// Emits XtraLife relative console log messages only if LOG is set to true
xtralife.LOG = true;
xtralife.ConsoleLog = function() { if (xtralife.LOG) { console.log.apply(console, Array.prototype.slice.call(arguments, 0)); } };
xtralife.ConsoleWarn = function() { if (xtralife.LOG) { console.warn.apply(console, Array.prototype.slice.call(arguments, 0)); } };
xtralife.ConsoleError = function() { if (xtralife.LOG) { console.error.apply(console, Array.prototype.slice.call(arguments, 0)); } };

// Application environment credentials
xtralife.APP_CREDENTIALS = {
	SANDBOX: { apiKey: "d02a7AoFM8McnQR", apiSecret: "W4iZjw60mBvnRmRaNnp7" }
};

// Displayed error messages
xtralife.DISPLAYED_ERROR = {
	DEFAULT_MESSAGE: "Wops! Something bad happened... ☹",
	BAD_CREDENTIALS: "The provided credentials do not match.",
	EMAIL_ADDRESS_DOESNT_EXIST: "The provided email address has not registered yet.",
	EMAIL_ADDRESS_INVALID: "The provided email address is invalid.",
	FACEBOOK_AUTH_FAILED: "Facebook authentication failed.",
	GAMER_ID_INVALID: "The provided gamer identifier is invalid.",
	LOGGED_OUT: "You are currently logged out.",
	RESUME_SESSION_FAILED: "Failed to resume previous session."
};

// Immediate initialization on page load
xtralife.Init = function()
{
	xtralife.ConsoleLog("[XtraLife:Init]", "Initializing...");
	xtralife.clan = Clan(xtralife.APP_CREDENTIALS.SANDBOX.apiKey, xtralife.APP_CREDENTIALS.SANDBOX.apiSecret);
};

/*----------------*/
/* Login Features */
/*----------------*/

// Ensures there is only one xtralife.login instance
xtralife.login = xtralife.login || {};

// Log in with an email account
xtralife.login.LoginEmail = function(email, password, preventRegistration, OnSuccess, OnError)
{
	xtralife.ConsoleLog("[Xtralife.login:LoginEmail]", "Connecting to an email account... (prevent registration: " + preventRegistration + ")");

	// If true, prevents from creating a new account if it doesn't exist yet
	var options = preventRegistration ? { preventRegistration: true } : {};
	
	xtralife.clan.login("email", email, password, options, function(error, gamer)
	{
		if (!error) { OnSuccess(gamer); }
		else
		{
			// Returns different error messages depending on the error name
			if (error.response.body.name === "BadArgument") { OnError(xtralife.DISPLAYED_ERROR.EMAIL_ADDRESS_INVALID); }
			else if (error.response.body.name === "BadUserCredentials") { OnError(xtralife.DISPLAYED_ERROR.BAD_CREDENTIALS); }
			else if (error.response.body.name === "PreventRegistration") { OnError(xtralife.DISPLAYED_ERROR.EMAIL_ADDRESS_DOESNT_EXIST); }
			else { OnError(xtralife.DISPLAYED_ERROR.DEFAULT_MESSAGE); }
		}
	});
};

// Log in with a Facebook account
xtralife.login.LoginFacebook = function(OnSuccess, OnError)
{
	xtralife.ConsoleLog("[Xtralife.login:LoginFacebook]", "Connecting to a Facebook account...");
	
	// Log in Facebook and Sample's Facebook App to get the Facebook access token
	facebook.FacebookAppLogin(function(facebookAccessToken)
	{
		// We use access token from Facebook login to log into XtraLife
		xtralife.clan.login("facebook", "", facebookAccessToken, function(error, gamer)
		{
			if (!error) { OnSuccess(gamer); }
			else
			{
				// Returns different error messages depending on the error name
				if (error.response.body.name === "LoginError") { OnError(xtralife.DISPLAYED_ERROR.FACEBOOK_AUTH_FAILED); }
				else { OnError(xtralife.DISPLAYED_ERROR.DEFAULT_MESSAGE); }
			}
		});
	});
};

// Log out the currently logged in account
xtralife.login.Logout = function(OnSuccess, OnError)
{
	xtralife.ConsoleLog("[Xtralife.login:Logout]", "Disconnecting the current account...");
	
	if (sample.currentGamer)
	{
		xtralife.clan.withGamer(sample.currentGamer).logout(function(error)
		{
			if (!error) { OnSuccess(); }
			else { OnError(xtralife.DISPLAYED_ERROR.DEFAULT_MESSAGE); }
		});
	}
	else { OnError(xtralife.DISPLAYED_ERROR.LOGGED_OUT); }
};

// Log in with previously obtained gamerId and gamerSecret
xtralife.login.ResumeSession = function(gamerId, gamerSecret, OnSuccess, OnError)
{
	xtralife.ConsoleLog("[Xtralife.login:ResumeSession]", "Connecting to a previously created account...");
	
	xtralife.clan.resumeSession(gamerId, gamerSecret, function(error, gamer)
	{
		if (!error) { OnSuccess(gamer); }
		else
		{
			console.error(error.response.body);
			// Returns different error messages depending on the error name
			if (error.response.body.name === "BadGamerID") { OnError(xtralife.DISPLAYED_ERROR.GAMER_ID_INVALID); }
			else if (error.response.body.name === "BadUserCredentials") { OnError(xtralife.DISPLAYED_ERROR.BAD_CREDENTIALS); }
			else if (error.response.body.name === "LoginError") { OnError(xtralife.DISPLAYED_ERROR.RESUME_SESSION_FAILED); }
			else { OnError(xtralife.DISPLAYED_ERROR.DEFAULT_MESSAGE); }
		}
	});
};

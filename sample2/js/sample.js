/*----------------*/
/* Initialization */
/*----------------*/

// Ensures there is only one sample instance
window.sample = window.sample || {};

// Emits Sample relative console log messages only if LOG is set to true
sample.LOG = true;
sample.ConsoleLog = function() { if (sample.LOG) { console.log.apply(console, Array.prototype.slice.call(arguments, 0)); } };
sample.ConsoleWarn = function() { if (sample.LOG) { console.warn.apply(console, Array.prototype.slice.call(arguments, 0)); } };
sample.ConsoleError = function() { if (sample.LOG) { console.error.apply(console, Array.prototype.slice.call(arguments, 0)); } };

// Local storage variables names
sample.LOCALSTORAGE = {
	LAST_LOGIN_EMAIL: "lastLoginEmail",
	LOGIN_CREDENTIALS: "loginCredentials"
};

// Displayed error messages
sample.DISPLAYED_ERROR = {
	PASSWORDS_DONT_MATCH: "Passwords do not match."
};

// If the login box should be automatically shown at page load if no gamer is logged in
sample.AUTO_LOGIN_BOX = true;

// Immediate initialization on page load
sample.Init = function()
{
	sample.ConsoleLog("[Sample:Init]", "Initializing...");
	sample.login.SelectLoginEmailBox("signin");
	sample.login.ShowLoginBox(false);
	sample.login.CheckCredentials();
};

// This callback will be called once the gamer has logged in, no matter by which method
sample.OnGamerLoggedIn = function()
{
	sample.ConsoleWarn("[Sample:OnGamerLoggedIn]", "Gamer has logged in!", sample.currentGamer);

	// Do whatever...
};

// This callback will be called once the gamer has logged out
sample.OnGamerLoggedOut = function()
{
	sample.ConsoleWarn("[Sample:OnGamerLoggedOut]", "Gamer has logged out!");

	// Do whatever...
};

/*----------------*/
/* Login Features */
/*----------------*/

// Ensures there is only one sample.login instance
window.sample.login = window.sample.login || {};

// Login box sections names
sample.login.SECTION = {
	ERROR: "xtralife-login-section-error",
	LOGGINGIN: "xtralife-login-section-loggingin",
	METHODS: "xtralife-login-section-methods"
};

// Tries to login with stored credentials or ask the user to choose a login method
// The autoLoginBox option, if set to true, automatically show the login box if no credentials are found to resume last gamer session
sample.login.CheckCredentials = function()
{
	sample.login.UpdateLoginStatus();

	// Get local storage stored data
	var lastLoginEmail = localStorage.getItem(sample.LOCALSTORAGE.LAST_LOGIN_EMAIL);
	var loginCredentials = JSON.parse(localStorage.getItem(sample.LOCALSTORAGE.LOGIN_CREDENTIALS));
	
	// If there is a stored last login email address, auto-fills email sign in input with it
	if (lastLoginEmail) { document.getElementById("xtralife-login-email-signin-email").value = lastLoginEmail; }
	
	// If there are stored credentials, tries to resume session with them then go to the home page
	if (loginCredentials)
	{
		sample.ConsoleWarn("[Sample.login:CheckCredentials]", "Credentials stored >> Trying to resume session...");
		sample.login.ResumeSession(loginCredentials.gamerId, loginCredentials.gamerSecret);
	}
	// Else, shows the login box if this option is enabled
	else if (sample.AUTO_LOGIN_BOX)
	{
		sample.ConsoleWarn("[Sample.login:CheckCredentials]", "No credentials stored >> Showing login box...");
		sample.login.ShowLoginBox(true);
	}
	else { sample.ConsoleWarn("[Sample.login:CheckCredentials]", "No credentials stored >> No gamer currently logged in"); }
};

// Displays if there is a currently logged in gamer
sample.login.UpdateLoginStatus = function()
{
	// Updates the displayed login status and buttons (if sample.currentGamer does exit, a gamer is logged in)
	if (sample.currentGamer)
	{
		document.getElementById("xtralife-login-status").innerHTML = "logged in as " + sample.currentGamer.profile.displayName + " (" + sample.currentGamer.network + ")";
		document.getElementById("xtralife-login-button").classList.add("xtralife-hidden");
		document.getElementById("xtralife-logout-button").classList.remove("xtralife-hidden");
	}
	else
	{
		document.getElementById("xtralife-login-status").innerHTML = "logged out";
		document.getElementById("xtralife-logout-button").classList.add("xtralife-hidden");
		document.getElementById("xtralife-login-button").classList.remove("xtralife-hidden");
	}
};

	/*-----------*/
	/* Login Box */
	/*-----------*/

// Shows/Hides the login box (and the background mask)
sample.login.ShowLoginBox = function(show)
{
	sample.ConsoleLog("[Sample.login:ShowLoginBox]", "Showing login box... (" + show + ")");
	
	// Shows the login box (and the background mask)
	if (show)
	{
		sample.login.SelectLoginSection(sample.login.SECTION.METHODS);
		document.getElementById("xtralife-mask").classList.remove("xtralife-hidden");
		document.getElementById("xtralife-login").classList.remove("xtralife-hidden");
	}
	// Hides the login box (and the background mask)
	else
	{
		document.getElementById("xtralife-mask").classList.add("xtralife-hidden");
		document.getElementById("xtralife-login").classList.add("xtralife-hidden");
	}
};

// Displays only the selected section
sample.login.SelectLoginSection = function(selectedSection)
{
	sample.ConsoleLog("[Sample.login:SelectLoginSection]", "Displaying '" + selectedSection + "' login section...");
	
	// Hides all sections
	for (var section in sample.login.SECTION) { document.getElementById(sample.login.SECTION[section]).classList.add("xtralife-hidden"); }

	// Shows the given section
	document.getElementById(selectedSection).classList.remove("xtralife-hidden");
};

// Displays only the selected email login method box
sample.login.SelectLoginEmailBox = function(selectedMethod)
{
	sample.ConsoleLog("[Sample.login:SelectLoginEmailBox]", "Displaying '" + selectedMethod + "' email login method...");
	
	if (selectedMethod === "signin")
	{
		// Shows the selected login email method body
		document.getElementById("xtralife-login-method-email-signin").classList.remove("xtralife-hidden");
		document.getElementById("xtralife-login-method-email-register").classList.add("xtralife-hidden");

		// Updates the login email method selector buttons
		document.getElementById("xtralife-login-email-selector-signin").classList.remove("xtralife-login-email-selector-unselected");
		document.getElementById("xtralife-login-email-selector-signin").classList.add("xtralife-login-email-selector-selected");
		document.getElementById("xtralife-login-email-selector-register").classList.remove("xtralife-login-email-selector-selected");
		document.getElementById("xtralife-login-email-selector-register").classList.add("xtralife-login-email-selector-unselected");
	}
	else // selectedMethod === "register"
	{
		// Shows the selected login email method body
		document.getElementById("xtralife-login-method-email-signin").classList.add("xtralife-hidden");
		document.getElementById("xtralife-login-method-email-register").classList.remove("xtralife-hidden");

		// Updates the login email method selector buttons
		document.getElementById("xtralife-login-email-selector-signin").classList.remove("xtralife-login-email-selector-selected");
		document.getElementById("xtralife-login-email-selector-signin").classList.add("xtralife-login-email-selector-unselected");
		document.getElementById("xtralife-login-email-selector-register").classList.remove("xtralife-login-email-selector-unselected");
		document.getElementById("xtralife-login-email-selector-register").classList.add("xtralife-login-email-selector-selected");
	}
};

	/*------------------------------*/
	/* Email/Facebook Login Methods */
	/*------------------------------*/

// Tries to login with an existing email account (sign in)
sample.login.LoginEmail_SignIn = function()
{
	sample.ConsoleLog("[Sample.login:LoginEmail_SignIn]", "Logging in with existing email account...");
	
	// Retrieves input values
	var email = document.getElementById("xtralife-login-email-signin-email").value;
	var password = document.getElementById("xtralife-login-email-signin-password").value;
	
	// Shows the login is going on and tries to log in with an existing email account >> Prevents new email registration
	sample.login.SelectLoginSection(sample.login.SECTION.LOGGINGIN);
	xtralife.login.LoginEmail(email, password, true, function(gamer)
	{
		// In case of successful email login, keeps the used email address to auto-fill email sign in input then calls the login success callback
		localStorage.setItem(sample.LOCALSTORAGE.LAST_LOGIN_EMAIL, email);
		sample.login.OnLoginSuccess(gamer);
	}, sample.login.OnLoginError);
};

// Tries to login with a new (or existing) email account (register)
sample.login.LoginEmail_Register = function()
{
	sample.ConsoleLog("[Sample.login:LoginEmail_Register]", "Logging in with new email account...");
	
	// Retrieves input values
	var email = document.getElementById("xtralife-login-email-register-email").value;
	var password1 = document.getElementById("xtralife-login-email-register-password1").value;
	var password2 = document.getElementById("xtralife-login-email-register-password2").value;
	
	// Checks if the 2 given passwords match
	if (password1 === password2)
	{
		// Shows the login is going on and tries to log in with a new (or existing) email account >> Allows new email registration
		sample.login.SelectLoginSection(sample.login.SECTION.LOGGINGIN);
		xtralife.login.LoginEmail(email, password1, false, function(gamer)
		{
			// In case of successful email login, keeps the used email address to auto-fill email sign in input then calls the login success callback
			localStorage.setItem(sample.LOCALSTORAGE.LAST_LOGIN_EMAIL, email);
			sample.login.OnLoginSuccess(gamer);
		}, sample.login.OnLoginError);
	}
	else { sample.login.OnLoginError(sample.DISPLAYED_ERROR.PASSWORDS_DONT_MATCH); }
};

// Tries to login with a Facebook account
sample.login.LoginFacebook = function()
{
	sample.ConsoleLog("[Sample.login:LoginFacebook]", "Logging in with Facebook...");
	
	// Shows the login is going on and tries to log in with a Facebook account
	sample.login.SelectLoginSection(sample.login.SECTION.LOGGINGIN);
	xtralife.login.LoginFacebook(function(gamer)
	{
		// In case of successful Facebook login, discards the last login email address then calls the login success callback
		localStorage.removeItem(sample.LOCALSTORAGE.LAST_LOGIN_EMAIL);
		sample.login.OnLoginSuccess(gamer);
	}, sample.login.OnLoginError);
};

// Login success behaviour
sample.login.OnLoginSuccess = function(gamer)
{
	sample.ConsoleLog("[Sample.login:OnLoginSuccess]", "Successfully logged in!");
	
	// Keeps the logged in gamer data
	sample.currentGamer = gamer;
	sample.login.UpdateLoginStatus();
	
	// Stores the logged in account's gamerId/gamerSecret credentials
	var loginCredentials = { gamerId: gamer.gamer_id, gamerSecret: gamer.gamer_secret };
	localStorage.setItem(sample.LOCALSTORAGE.LOGIN_CREDENTIALS, JSON.stringify(loginCredentials));
	
	// Empties the email sign in and register inputs
	document.getElementById("xtralife-login-email-signin-email").value = "";
	document.getElementById("xtralife-login-email-signin-password").value = "";
	document.getElementById("xtralife-login-email-register-email").value = "";
	document.getElementById("xtralife-login-email-register-password1").value = "";
	document.getElementById("xtralife-login-email-register-password2").value = "";
	
	// Hides the login box and trigger the OnGamerLoggedIn callback
	sample.login.ShowLoginBox(false);
	sample.OnGamerLoggedIn();
};

// Login error behaviour
sample.login.OnLoginError = function(error)
{
	sample.ConsoleError("[Sample.login:OnLoginError]", error);
	
	// Sets a login error
	document.getElementById("xtralife-login-error-message").innerHTML = error;
	sample.login.SelectLoginSection(sample.login.SECTION.ERROR);
};

	/*----------------------------*/
	/* ResumeSession Login Method */
	/*----------------------------*/

// Tries to login with gamer id and secret
sample.login.ResumeSession = function(gamerId, gamerSecret)
{
	sample.ConsoleLog("[Sample.login:ResumeSession]", "Resuming session...");
	
	// Tries to connect to a previously created account
	xtralife.login.ResumeSession(gamerId, gamerSecret, sample.login.OnResumeSessionSuccess, sample.login.OnResumeSessionError);
};

// Resume session success behaviour
sample.login.OnResumeSessionSuccess = function(gamer)
{
	sample.ConsoleLog("[Sample.login:OnResumeSessionSuccess]", "Successfully resumed last session!");
	
	// Keeps the logged in gamer data and trigger the OnGamerLoggedIn callback
	sample.currentGamer = gamer;
	sample.login.UpdateLoginStatus();
	sample.OnGamerLoggedIn();
};

// Resume session error behaviour
sample.login.OnResumeSessionError = function(error)
{
	sample.ConsoleError("[Sample.login:OnResumeSessionError]", error);
	
	// Sets a login error and shows the login box if this option is enabled
	if (sample.AUTO_LOGIN_BOX) { sample.login.ShowLoginBox(true); }
	document.getElementById("xtralife-login-error-message").innerHTML = error;
	sample.login.SelectLoginSection(sample.login.SECTION.ERROR);
};

	/*--------*/
	/* Logout */
	/*--------*/

// Tries to logout the currently connected account
sample.login.Logout = function()
{
	sample.ConsoleLog("[Sample.login:Logout]", "Logging out account...");
	
	// Disconnects the currently connected account
	xtralife.login.Logout(sample.login.OnLogoutSuccess, sample.login.OnLogoutError);
	
	// Discards the previously connected gamer data
	sample.currentGamer = null;
	
	// Deletes the previously connected account's gamerId/gamerSecret credentials
	localStorage.removeItem(sample.LOCALSTORAGE.LOGIN_CREDENTIALS);
	
	// Check credentials again
	sample.login.CheckCredentials();
};

// Logout success behaviour
sample.login.OnLogoutSuccess = function()
{
	sample.ConsoleLog("[Sample.login:OnLogoutSuccess]", "Successfully logged out!");
};

// Logout error behaviour
sample.login.OnLogoutError = function(error)
{
	sample.ConsoleError("[Sample.login:OnLogoutError]", error);
};

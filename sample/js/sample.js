// Those are the Api Key and Secret of your game, use your own keys provided in your game's configuration files !
var YourGameApiKey = "testgame-key";
var YourGameApiSecret = "testgame-secret";
var endpoint = 'http://localhost:2000'

function CheckCredentials()
{
	if ((YourGameApiKey == "YourGameApiKey") || (YourGameApiSecret == "YourGameApiSecret"))
		document.getElementById("header-credentials").innerHTML = "<u><b>Please change the default Api Key and Secret variables in \"sample.js\" by your game's ones (provided on your frontoffice).</b></u>";
}

// This is our Sample constructor to handle all data relative to the SDK
function Sample(storageManager, autoLoginAnonymously)
{
	this.storageManager = storageManager;
	this.Setup(autoLoginAnonymously);
	this.LoggedInHeaderDisplay();
	this.LoggedInBodyDisplay();
}

// Initialize an instance of the Clan with the API credentials (testgame-apikey, testgame-secret)
Sample.prototype.Setup = function(autoLoginAnonymously)
{
	// Initialize our client with the APIKEY and APISECRET of the game
	this.clan = Clan(YourGameApiKey, YourGameApiSecret, endpoint);
	
	// Retrieve the current logged in gamer's data if any
	if (this.storageManager.GetData("gamer"))
		this.gamerData = JSON.parse(this.storageManager.GetData("gamer"));
	
	// You may add an auto-login logic here if you want to ensure a gamer is logged in:
	if (autoLoginAnonymously)
	{
		// We need to log in if not done already
		if (this.gamerData)
			ConsoleLog("[AutoLogin] Using last login gamer data: " + JSON.stringify(this.gamerData));
		else
		{
			ConsoleLog("[AutoLogin] No last login gamer data found, LoginAnonymously...");
			this.LoginAnonymously(this.LoginDone);
		}
	}
};

// Updates a header HTML tag to show if a gamer data exists (logged in) or not
Sample.prototype.LoggedInHeaderDisplay = function()
{
	var headerLoginStatus = document.getElementById("header-login");
	
	if (this.gamerData)
		headerLoginStatus.innerHTML = "(gamerID: " + this.gamerData.gamer_id + ")";
	else
		headerLoginStatus.innerHTML = "(currently logged out, please <a href=\"./login.html\">log in</a>)";
}

// Updates a body HTML tag to show if a gamer data exists (logged in) or not
Sample.prototype.LoggedInBodyDisplay = function()
{
	var bodyLoginStatus = document.getElementById("body-login");
	
	if (this.gamerData)
	{
		var loginIcon = "";
		
		if (this.gamerData.network == "anonymous")
			loginIcon = "<img src=\"img/logomini-xtralife.png\" alt=\"[LogoMini XtraLife]\" />";
		else if (this.gamerData.network == "facebook")
			loginIcon = "<img src=\"img/logomini-facebook.png\" alt=\"[LogoMini Facebook]\" />";
		
		if (bodyLoginStatus)
			bodyLoginStatus.innerHTML = "Currently logged in (gamerID: " + this.gamerData.gamer_id + ") with " + loginIcon + " '" + this.gamerData.network + "' network type.";
	}
	else if (bodyLoginStatus)
	{
		var loginIcon = "<img src=\"img/logomini-nosign.png\" alt=\"[LogoMini Nosign]\" />";
		bodyLoginStatus.innerHTML = loginIcon + " Currently logged out.";
	}
}

// Updates a HTML tag to show if a gamer data exists (logged in) or not
Sample.prototype.LoggedInCheck = function()
{
	if (this.gamerData)
		ConsoleLog("Currently logged in (gamerID: " + this.gamerData.gamer_id + ") with '" + this.gamerData.network + "' network type, gamer data:<br />" + JSON.stringify(this.gamerData));
	else
		ConsoleLog("Currently logged out");
}

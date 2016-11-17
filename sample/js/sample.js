// Those are the Api Key and Secret of your game, use your own keys provided when registering!
var YourGameApiKey = "YourGameApiKey";
var YourGameApiSecret = "YourGameApiSecret";

function CheckCredentials()
{
	if ((YourGameApiKey == "YourGameApiKey") || (YourGameApiSecret == "YourGameApiSecret"))
		document.getElementById("header-credentials").innerHTML = "Please change the default Api Key and Secret variables in <b>\"sample.js\"</b> by your game's ones (provided on your frontoffice).";
}

/* ---------------------------------- */
/* ---------- Sample Setup ---------- */
/* ---------------------------------- */

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
	this.clan = Clan(YourGameApiKey, YourGameApiSecret);
	
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

/* ------------------------------------ */
/* ---------- Login Features ---------- */
/* ------------------------------------ */

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
	this.clan.login("anonymous", gamerId, gamerSecret, function(error, gamer)
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

/* -------------------------------------------------------- */
/* ---------- VFS (Virtual File System) features ---------- */
/* -------------------------------------------------------- */

// An helper to display VFS results as a text
Sample.prototype.VfsTextDisplay = function(container, text)
{
	if (container)
	{
		var finalText = "<p><b>" + text + "</b></p>";
		container.innerHTML = finalText;
	}
}

// An helper to display VFS key values as a table
Sample.prototype.VfsTableDisplay = function(container, keyValues)
{
	if (container)
	{
		var finalTable = "<table><tr><td class=\"col_a title\"><b>Key(s)</b></td><td class=\"col_b title\"><b>Value(s)</b></td></tr>";
		var foundKey = false;
		
		for (var key in keyValues)
		{
			finalTable += "<tr><td class=\"col_a\"><p>" + key + "</p></td><td class=\"col_b\"><p>" + keyValues[key] + "</p></td></tr>";
			if (!foundKey) { foundKey = true; }
		}
		
		if (foundKey == false)
			finalTable += "<tr><td class=\"col_a\"><p>-</p></td><td class=\"col_b\"><p>(No key value found)</p></td></tr>";
		
		finalTable += "</table>";
		container.innerHTML = finalTable;
	}
}

// Set a gamer VFS key with given value (can handle any standard var type, including Json objets, but we use only strings in this sample)
Sample.prototype.GamerVfsSet = function(gamerVfsSetKey, gamerVfsSetValue)
{
	var self = this;
	var bodyGamerVfsStatus = document.getElementById("body-gamer-vfs");
	
	if (this.gamerData)
	{
		// Domains are used to scope gamer data
		// The private domain is specific to the current game while shared domains allow a gamer to share the same VFS keys in all games sharing those respective domains
		// this.clan.privateDomain is the equivalent of the "private" string and is the default value if no domain is specified
		var vfsDomain = this.clan.privateDomain;
		
		// The value field may be of any standard type or under Json object format
		// (e.g. Key: Profile / Value: {"Name":"John", "Surname":"Doe", "Age":21})
		// (e.g. Key: LastSearch / Value: Cookies)
		this.clan.withGamer(this.gamerData).gamervfs(vfsDomain).set(gamerVfsSetKey, gamerVfsSetValue, function(error, result)
		{
			// If the operation went wrong for some reason
			if (error)
			{
				var errorMessage = "VFS Set error: " + error;
				ConsoleLog(errorMessage);
				self.VfsTextDisplay(bodyGamerVfsStatus, errorMessage);
			}
			// If the operation succeeded
			else
			{
				var resultMessage = "VFS Set (Key: " + gamerVfsSetKey + " / Value: " + gamerVfsSetValue + ") -> " + JSON.stringify(result);
				ConsoleLog(resultMessage);
				self.VfsTextDisplay(bodyGamerVfsStatus, resultMessage);
			}
		});
	}
	// If no gamer is logged in, this feature is unavailable
	else
	{
		var errorMessage = "VFS Set error: Can't use VFS features without logged in gamer data";
		ConsoleLog(errorMessage);
		this.VfsTextDisplay(bodyGamerVfsStatus, errorMessage);
	}
}

// Get a gamer VFS key value
Sample.prototype.GamerVfsGet = function(gamerVfsGetKey)
{
	var self = this;
	var bodyGamerVfsStatus = document.getElementById("body-gamer-vfs");
	
	if (this.gamerData)
	{
		// Domains are used to scope gamer data
		// The private domain is specific to the current game while shared domains allow a gamer to share the same VFS keys in all games sharing those respective domains
		// this.clan.privateDomain is the equivalent of the "private" string and is the default value if no domain is specified
		var vfsDomain = this.clan.privateDomain;
		
		// An empty key field will get all existing keys instead of a specified one
		this.clan.withGamer(this.gamerData).gamervfs(vfsDomain).get(gamerVfsGetKey, function(error, result)
		{
			// If the operation went wrong for some reason
			if (error)
			{
				var errorMessage = "VFS Get error: " + error;
				ConsoleLog(errorMessage);
				self.VfsTextDisplay(bodyGamerVfsStatus, errorMessage);
			}
			// If the operation succeeded
			else
			{
				var resultMessage = "VFS Get (Key: " + gamerVfsGetKey + ") -> " + JSON.stringify(result);
				ConsoleLog(resultMessage);
				
				if (gamerVfsGetKey)
				{
					var json = {};
					json[gamerVfsGetKey] = result;
					self.VfsTableDisplay(bodyGamerVfsStatus, json);
				}
				else
					self.VfsTableDisplay(bodyGamerVfsStatus, result);
			}
		});
	}
	// If no gamer is logged in, this feature is unavailable
	else
	{
		var errorMessage = "VFS Get error: Can't use VFS features without logged in gamer data";
		ConsoleLog(errorMessage);
		this.VfsTextDisplay(bodyGamerVfsStatus, errorMessage);
	}
}

// Delete a gamer VFS key
Sample.prototype.GamerVfsDelete = function(gamerVfsDeleteKey)
{
	var self = this;
	var bodyGamerVfsStatus = document.getElementById("body-gamer-vfs");
	
	if (this.gamerData)
	{
		// Domains are used to scope gamer data
		// The private domain is specific to the current game while shared domains allow a gamer to share the same VFS keys in all games sharing those respective domains
		// this.clan.privateDomain is the equivalent of the "private" string and is the default value if no domain is specified
		var vfsDomain = this.clan.privateDomain;
		
		// An empty key field will delete all existing keys instead of a specified one, so double check this!
		this.clan.withGamer(this.gamerData).gamervfs(vfsDomain).del(gamerVfsDeleteKey, function(error, result)
		{
			// If the operation went wrong for some reason
			if (error)
			{
				var errorMessage = "VFS Delete error: " + error;
				ConsoleLog(errorMessage);
				self.VfsTextDisplay(bodyGamerVfsStatus, errorMessage);
			}
			// If the operation succeeded
			else
			{
				var resultMessage = "VFS Delete (Key: " + gamerVfsDeleteKey + ") -> " + JSON.stringify(result);
				ConsoleLog(resultMessage);
				self.VfsTextDisplay(bodyGamerVfsStatus, resultMessage);
			}
		});
	}
	// If no gamer is logged in, this feature is unavailable
	else
	{
		var errorMessage = "VFS Delete error: Can't use VFS features without logged in gamer data";
		ConsoleLog(errorMessage);
		this.VfsTextDisplay(bodyGamerVfsStatus, errorMessage);
	}
}

// Get a game VFS key value
Sample.prototype.GameVfsGet = function(gameVfsGetKey)
{
	var self = this;
	var bodyGameVfsStatus = document.getElementById("body-game-vfs");
	
	// Domains are used to scope game data
	// The private domain is specific to the current game while shared domains allow a game to share the same VFS keys with all other games sharing those respective domains
	// this.clan.privateDomain is the equivalent of the "private" string and is the default value if no domain is specified
	var vfsDomain = this.clan.privateDomain;
	
	// An empty key field will get all existing keys instead of a specified one
	this.clan.vfs(vfsDomain).get(gameVfsGetKey, function(error, result)
	{
		// If the operation went wrong for some reason
		if (error)
		{
			var errorMessage = "VFS Get error: " + error;
			ConsoleLog(errorMessage);
			self.VfsTextDisplay(bodyGameVfsStatus, errorMessage);
		}
		// If the operation succeeded
		else
		{
			var resultMessage = "VFS Get (Key: " + gameVfsGetKey + ") -> " + JSON.stringify(result);
			ConsoleLog(resultMessage);
			
			if (gameVfsGetKey)
			{
				var json = {};
				json[gameVfsGetKey] = result;
				self.VfsTableDisplay(bodyGameVfsStatus, json);
			}
			else
				self.VfsTableDisplay(bodyGameVfsStatus, result);
		}
	});
}

/* ------------------------------------------ */
/* ---------- Leaderboard features ---------- */
/* ------------------------------------------ */

// An helper to display leaderboard results as a text
Sample.prototype.LeaderboardTextDisplay = function(container, text)
{
	if (container)
	{
		var finalText = "<p><b>" + text + "</b></p>";
		container.innerHTML = finalText;
	}
}

// An helper to display leaderboard scores as a table
Sample.prototype.LeaderboardTableDisplay = function(container, leaderboards)
{
	if (container)
	{
		var finalTable = "<table><tr><td class=\"col_a title\"><b>Board(s)</b></td><td class=\"col_b title\"><b>Score(s) Data</b></td></tr>";
		var foundKey = false;
		
		for (var board in leaderboards)
		{
			finalTable += "<tr><td class=\"col_a\"><p>" + board + "</p></td><td class=\"col_b\"><p>" + JSON.stringify(leaderboards[board]) + "</p></td></tr>";
			if (!foundKey) { foundKey = true; }
		}
		
		if (foundKey == false)
			finalTable += "<tr><td class=\"col_a\"><p>-</p></td><td class=\"col_b\"><p>(No score found in boards)</p></td></tr>";
		
		finalTable += "</table>";
		container.innerHTML = finalTable;
	}
}

// An helper to display leaderboard scores as a paged table
Sample.prototype.LeaderboardTablePagedDisplay = function(container, boardName, boardScores, scoresAmount)
{
	if (container)
	{
		var finalTable = "<table><tr><td class=\"col_a title\"><b>Board:<br />" + boardName + "</b></td><td class=\"col_b title\"><b>Score(s) Data (Page " + boardScores.page + " / " + boardScores.maxpage + ", " + scoresAmount + " score(s) max per page)</b></td></tr>";
		var scoresNumber = 0;
		
		while (scoresNumber < boardScores.scores.length)
		{
	ConsoleLog(boardScores.scores[scoresNumber]);
	ConsoleLog(JSON.stringify(boardScores.scores[scoresNumber]));
			finalTable += "<tr><td class=\"col_a\"><p>Rank #" + (boardScores.rankOfFirst + scoresNumber) + "<br />Gamer Pseudo: " + boardScores.scores[scoresNumber].profile.displayName + "</p></td><td class=\"col_b\"><p>Score: " + boardScores.scores[scoresNumber].score.score + ", Post Date: " + boardScores.scores[scoresNumber].score.timestamp + ", Description: " + boardScores.scores[scoresNumber].score.info + "</p></td></tr>";
			++scoresNumber;
		}
		
		if (scoresNumber == 0)
			finalTable += "<tr><td class=\"col_a\"><p>-</p></td><td class=\"col_b\"><p>(No score found in board)</p></td></tr>";
		
		finalTable += "</table>";
		container.innerHTML = finalTable;
	}
}

// Set a gamer score with given value on given board
Sample.prototype.LeaderboardSet = function(boardSortOrder, boardName, scoreValue, scoreInfo)
{
	var self = this;
	var bodyLeaderboardStatus = document.getElementById("body-leaderboard");
	
	if (this.gamerData)
	{
		// Domains are used to scope gamer data
		// The private domain is specific to the current game while shared domains allow games to share data between them across those respective domains
		// this.clan.privateDomain is the equivalent of the "private" string and is the default value if no domain is specified
		var leaderboardDomain = this.clan.privateDomain;
		
		// Here we build a Json object representing a score with its value and its description (info)
		var scoreObject = {"score": Number(scoreValue), "info": scoreInfo};
		
		// You may create monthly based boards by naming them after the post date for instance (e.g. SurvivalBoard-2016-06, SurvivalBoard-2016-07, and so on...)
		// The sort order may be "lowtohigh" or "hightolow" and is used to establish if the posted score is better than the previous gamer's best one on this board, and should always be the same for consistency logic
		// The score value may be any number (in this sample, we convert this value into a Number as we get it from a string input field)
		// The score description is a short text or a Json object you may want to attach to the posted score
		// (e.g. {"Level":15, "UsedBoosters":0})
		this.clan.withGamer(this.gamerData).leaderboards(leaderboardDomain).set(boardName, boardSortOrder, scoreObject, function(error, result)
		{
			// If the operation went wrong for some reason
			if (error)
			{
				var errorMessage = "Leaderboard Set error: " + error;
				ConsoleLog(errorMessage);
				self.LeaderboardTextDisplay(bodyLeaderboardStatus, errorMessage);
			}
			// If the operation succeeded
			else
			{
				var resultMessage = "Leaderboard Set (Sort Order: " + boardSortOrder + ", Board Name: " + boardName + ", Score Object: " + JSON.stringify(scoreObject) + ") -> " + JSON.stringify(result);
				ConsoleLog(resultMessage);
				self.LeaderboardTextDisplay(bodyLeaderboardStatus, resultMessage);
			}
		});
	}
	// If no gamer is logged in, this feature is unavailable
	else
	{
		var errorMessage = "Leaderboard Set error: Can't use leaderboard features without logged in gamer data";
		ConsoleLog(errorMessage);
		this.LeaderboardTextDisplay(bodyLeaderboardStatus, errorMessage);
	}
}

// Get gamer's best score for each board in which he posted at least one score
Sample.prototype.LeaderboardGet = function()
{
	var self = this;
	var bodyLeaderboardStatus = document.getElementById("body-leaderboard");
	
	if (this.gamerData)
	{
		// Domains are used to scope gamer data
		// The private domain is specific to the current game while shared domains allow games to share data between them across those respective domains
		// this.clan.privateDomain is the equivalent of the "private" string and is the default value if no domain is specified
		var leaderboardDomain = this.clan.privateDomain;
		
		this.clan.withGamer(this.gamerData).leaderboards(leaderboardDomain).get(function(error, result)
		{
			// If the operation went wrong for some reason
			if (error)
			{
				var errorMessage = "Leaderboard Get error: " + error;
				ConsoleLog(errorMessage);
				self.LeaderboardTextDisplay(bodyLeaderboardStatus, errorMessage);
			}
			// If the operation succeeded
			else
			{
				var resultMessage = "Leaderboard Get -> " + JSON.stringify(result);
				ConsoleLog(resultMessage);
				self.LeaderboardTableDisplay(bodyLeaderboardStatus, result);
			}
		});
	}
	// If no gamer is logged in, this feature is unavailable
	else
	{
		var errorMessage = "Leaderboard Get error: Can't use leaderboard features without logged in gamer data";
		ConsoleLog(errorMessage);
		this.LeaderboardTextDisplay(bodyLeaderboardStatus, errorMessage);
	}
}

// Get specific board scores on a given page
Sample.prototype.LeaderboardGetPaged = function(boardName, pageNumber, scoresAmount)
{
	var self = this;
	var bodyLeaderboardStatus = document.getElementById("body-leaderboard");
	
	if (this.gamerData)
	{
		// Domains are used to scope gamer data
		// The private domain is specific to the current game while shared domains allow games to share data between them across those respective domains
		// this.clan.privateDomain is the equivalent of the "private" string and is the default value if no domain is specified
		var leaderboardDomain = this.clan.privateDomain;
		
		// The first page is number 1 (not 0)
		// This request's result gives several infos, including the max number of pages for given board and scores amount to help you paging the results
		this.clan.withGamer(this.gamerData).leaderboards(leaderboardDomain).getHighscores(boardName, Number(pageNumber), Number(scoresAmount), function(error, result)
		{
			// If the operation went wrong for some reason
			if (error)
			{
				var errorMessage = "Leaderboard Get Paged error: " + error;
				ConsoleLog(errorMessage);
				self.LeaderboardTextDisplay(bodyLeaderboardStatus, errorMessage);
			}
			// If the operation succeeded
			else
			{
				var resultMessage = "Leaderboard Get Paged (Board Name: " + boardName + ", Page Number: " + pageNumber + ", Scores Amount: " + scoresAmount + ") -> " + JSON.stringify(result);
				ConsoleLog(resultMessage);
				/*
				var json = {};
				json[boardName] = result[boardName];
				self.LeaderboardTableDisplay(bodyLeaderboardStatus, json);
				*/
				self.LeaderboardTablePagedDisplay(bodyLeaderboardStatus, boardName, result[boardName], scoresAmount);
			}
		});
	}
	// If no gamer is logged in, this feature is unavailable
	else
	{
		var errorMessage = "Leaderboard Get Paged error: Can't use leaderboard features without logged in gamer data";
		ConsoleLog(errorMessage);
		this.LeaderboardTextDisplay(bodyLeaderboardStatus, errorMessage);
	}
}

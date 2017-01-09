// A helper to display match results as a text
Sample.prototype.MatchTextDisplay = function(container, text)
{
	if (container)
	{
		var finalText = "<p><b>" + text + "</b></p>";
		container.innerHTML = finalText;
	}
}

// A helper to display matches as a table
Sample.prototype.MatchTableDisplay = function(container, matches, count, total)
{
	if (container)
	{
		var finalTable = "<table><tr><td class=\"col_a title\"><b>Match(es) (" + count + " hits on " + total + " found)</b></td><td class=\"col_b title\"><b>Indexed Properties + Payload</b></td></tr>";
		var foundMatch = false;
		
		for (var match in matches)
		{
			finalTable += "<tr><td class=\"col_a\"><p>ID: " + matches[match]._id + "</p></td><td class=\"col_b\"><p>" + JSON.stringify(matches[match]._source) + "</p></td></tr>";
			if (!foundMatch) { foundMatch = true; }
		}
		
		if (foundMatch == false)
			finalTable += "<tr><td colspan=\"3\"><p>(No match found)</p></td></tr>";
		
		finalTable += "</table>";
		container.innerHTML = finalTable;
	}
}

// Create a new match
Sample.prototype.MatchCreate = function(customProperties, indexedProperties, indexPayload, description, maxPlayers, shoeItems)
{
	var self = this;
	var bodyMatchCreateStatus = document.getElementById("body-match-create");
	
	if (this.gamerData)
	{
		// Domains are used to scope data
		// The private domain is specific to the current game while shared domains allow data to be shared across all games sharing those respective domains
		// this.clan.privateDomain is the equivalent of the "private" string and is the default value if no domain is specified
		var matchDomain = this.clan.privateDomain;
		
		// Here are the options we pass to the match creation
		var matchData = {};
		matchData.description = description;
		matchData.maxPlayers = Number(maxPlayers);
		if (customProperties) { matchData.customProperties = JSON.parse(customProperties); }
		if (shoeItems) { matchData.shoe = JSON.parse(shoeItems); }
		
		this.clan.withGamer(this.gamerData).matches(matchDomain).create(matchData, function(error, result)
		{
			// If the operation went wrong for some reason
			if (error)
			{
				var errorMessage = "Match Create error: " + error;
				ConsoleLog(errorMessage);
				self.MatchTextDisplay(bodyMatchCreateStatus, errorMessage);
			}
			// If the operation succeeded
			else
			{
				var resultMessageLong = "Match Create -> " + JSON.stringify(result);
				var resultMessageShort = "Match Create (Id: " + result.match._id + ", Seed: " + result.match.seed + ", Status: " + result.match.status + ") -> Success";
				ConsoleLog(resultMessageLong);
				self.MatchTextDisplay(bodyMatchCreateStatus, resultMessageShort);
				
				// Then, we index the match to make it available for indexed searching
				var properties = indexedProperties ? JSON.parse(indexedProperties) : {};
				var payload = indexPayload ? JSON.parse(indexPayload) : null;
				
				self.clan.indexes(matchDomain).set("Matches", result.match._id, properties, payload, function(indexError, indexResult)
				{
					// If the operation went wrong for some reason
					if (indexError)
					{
						var indexErrorMessage = "Match Index Create error: " + indexError;
						ConsoleLog(indexErrorMessage);
						self.MatchTextDisplay(bodyMatchCreateStatus, resultMessageShort + "<br />" + indexErrorMessage);
					}
					// If the operation succeeded
					else
					{
						var indexResultMessageLong = "Match Index Create -> " + JSON.stringify(indexResult);
						var indexResultMessageShort = "Match Index Create (Created: " + indexResult.created + ") -> Success";
						ConsoleLog(indexResultMessageLong);
						self.MatchTextDisplay(bodyMatchCreateStatus, resultMessageShort + "<br />" + indexResultMessageShort);
					}
				});
			}
		});
	}
	// If no gamer is logged in, this feature is unavailable
	else
	{
		var errorMessage = "Match Create error: Can't use match features without logged in gamer data";
		ConsoleLog(errorMessage);
		this.MatchTextDisplay(bodyMatchCreateStatus, errorMessage);
	}
}

// List existing indexed matches
Sample.prototype.MatchIndexList = function(properties, optionSort, optionSkip, optionLimit)
{
	var self = this;
	var bodyMatchListStatus = document.getElementById("body-match-list");
	
	if (this.gamerData)
	{
		// Domains are used to scope data
		// The private domain is specific to the current game while shared domains allow data to be shared across all games sharing those respective domains
		// this.clan.privateDomain is the equivalent of the "private" string and is the default value if no domain is specified
		var matchDomain = this.clan.privateDomain;
		
		// Here are the options we pass to the match indexed listing
		var indexedProperties = properties ? properties : "*";
		var sort = optionSort ? optionSort : null;
		var skip = optionSkip ? optionSkip : 0;
		var limit = optionLimit ? optionLimit : 0;
		
		this.clan.indexes(matchDomain).search("Matches", indexedProperties, sort, skip, limit, function(error, result)
		{
			// If the operation went wrong for some reason
			if (error)
			{
				var errorMessage = "Match List error: " + error;
				ConsoleLog(errorMessage);
				self.MatchTextDisplay(bodyMatchListStatus, errorMessage);
			}
			// If the operation succeeded
			else
			{
				var resultMessage = "Match List -> " + JSON.stringify(result);
				ConsoleLog(resultMessage);
				self.MatchTableDisplay(bodyMatchListStatus, result.hits, result.hits.length, result.total);
			}
		});
	}
	// If no gamer is logged in, this feature is unavailable
	else
	{
		var errorMessage = "Match List error: Can't use match features without logged in gamer data";
		ConsoleLog(errorMessage);
		this.MatchTextDisplay(bodyMatchListStatus, errorMessage);
	}
}

// Get specific match infos
Sample.prototype.MatchGet = function(matchID)
{
	var self = this;
	var bodyMatchListStatus = document.getElementById("body-match-list");
	
	if (this.gamerData)
	{
		// Domains are used to scope data
		// The private domain is specific to the current game while shared domains allow data to be shared across all games sharing those respective domains
		// this.clan.privateDomain is the equivalent of the "private" string and is the default value if no domain is specified
		var matchDomain = this.clan.privateDomain;
		
		this.clan.withGamer(this.gamerData).matches(matchDomain).get(matchID, function(error, result)
		{
			// If the operation went wrong for some reason
			if (error)
			{
				var errorMessage = "Match Get error: " + error;
				ConsoleLog(errorMessage);
				self.MatchTextDisplay(bodyMatchListStatus, errorMessage);
			}
			// If the operation succeeded
			else
			{
				var resultMessageLong = "Match Get -> " + JSON.stringify(result);
				var resultMessageShort = "Match Get (ID: " + result.match._id + ", Status: " + result.match.status + ", Last Event ID: " + result.match.lastEventId + ", Custom Properties: " + JSON.stringify(result.match.customProperties) + ") -> Success";
				ConsoleLog(resultMessageLong);
				self.MatchTextDisplay(bodyMatchListStatus, resultMessageShort);
			}
		});
	}
	// If no gamer is logged in, this feature is unavailable
	else
	{
		var errorMessage = "Match Get error: Can't use match features without logged in gamer data";
		ConsoleLog(errorMessage);
		this.MatchTextDisplay(bodyMatchListStatus, errorMessage);
	}
}

// Get specific match index infos
Sample.prototype.MatchIndexGet = function(matchID)
{
	var self = this;
	var bodyMatchListStatus = document.getElementById("body-match-list");
	
	// Domains are used to scope data
	// The private domain is specific to the current game while shared domains allow data to be shared across all games sharing those respective domains
	// this.clan.privateDomain is the equivalent of the "private" string and is the default value if no domain is specified
	var matchDomain = this.clan.privateDomain;
	
	this.clan.indexes(matchDomain).get("Matches", matchID, function(error, result)
	{
		// If the operation went wrong for some reason
		if (error)
		{
			var errorMessage = "Match Index Get error: " + error;
			ConsoleLog(errorMessage);
			self.MatchTextDisplay(bodyMatchListStatus, errorMessage);
		}
		// If the operation succeeded
		else
		{
			var resultMessageLong = "Match Index Get -> " + JSON.stringify(result);
			var resultMessageShort = "Match Index Get (Indexed Properties + Payload: " + JSON.stringify(result._source) + ") -> Success";
			ConsoleLog(resultMessageLong);
			self.MatchTextDisplay(bodyMatchListStatus, resultMessageShort);
		}
	});
}

// Join a match
Sample.prototype.MatchJoin = function(matchID, notification)
{
	var self = this;
	var bodyMatchJoinStatus = document.getElementById("body-match-join");
	
	if (this.gamerData)
	{
		// Domains are used to scope data
		// The private domain is specific to the current game while shared domains allow data to be shared across all games sharing those respective domains
		// this.clan.privateDomain is the equivalent of the "private" string and is the default value if no domain is specified
		var matchDomain = this.clan.privateDomain;
		
		var osNotification = notification ? JSON.parse(notification) : null;
		
		this.clan.withGamer(this.gamerData).matches(matchDomain).join(matchID, osNotification, function(error, result)
		{
			// If the operation went wrong for some reason
			if (error)
			{
				var errorMessage = "Match Join error: " + error;
				ConsoleLog(errorMessage);
				self.MatchTextDisplay(bodyMatchJoinStatus, errorMessage);
			}
			// If the operation succeeded
			else
			{
				var resultMessageLong = "Match Join -> " + JSON.stringify(result);
				var resultMessageShort = "Match Join (ID: " + result.match._id + ", Status: " + result.match.status + ", " + result.match.events.length + " Event(s)) -> Success";
				ConsoleLog(resultMessageLong);
				self.MatchTextDisplay(bodyMatchJoinStatus, resultMessageShort);
			}
		});
	}
	// If no gamer is logged in, this feature is unavailable
	else
	{
		var errorMessage = "Match Join error: Can't use match features without logged in gamer data";
		ConsoleLog(errorMessage);
		this.MatchTextDisplay(bodyMatchJoinStatus, errorMessage);
	}
}

// Leave a match
Sample.prototype.MatchLeave = function(matchID, notification)
{
	var self = this;
	var bodyMatchJoinStatus = document.getElementById("body-match-join");
	
	if (this.gamerData)
	{
		// Domains are used to scope data
		// The private domain is specific to the current game while shared domains allow data to be shared across all games sharing those respective domains
		// this.clan.privateDomain is the equivalent of the "private" string and is the default value if no domain is specified
		var matchDomain = this.clan.privateDomain;
		
		var osNotification = notification ? JSON.parse(notification) : null;
		
		this.clan.withGamer(this.gamerData).matches(matchDomain).leave(matchID, osNotification, function(error, result)
		{
			// If the operation went wrong for some reason
			if (error)
			{
				var errorMessage = "Match Leave error: " + error;
				ConsoleLog(errorMessage);
				self.MatchTextDisplay(bodyMatchJoinStatus, errorMessage);
			}
			// If the operation succeeded
			else
			{
				var resultMessage = "Match Leave -> " + JSON.stringify(result);
				ConsoleLog(resultMessage);
				self.MatchTextDisplay(bodyMatchJoinStatus, resultMessage);
			}
		});
	}
	// If no gamer is logged in, this feature is unavailable
	else
	{
		var errorMessage = "Match Leave error: Can't use match features without logged in gamer data";
		ConsoleLog(errorMessage);
		this.MatchTextDisplay(bodyMatchJoinStatus, errorMessage);
	}
}

// Invite a friend to join a match
Sample.prototype.MatchInvite = function(matchID, friendID, notification)
{
	var self = this;
	var bodyMatchInviteStatus = document.getElementById("body-match-invite");
	
	if (this.gamerData)
	{
		// Domains are used to scope data
		// The private domain is specific to the current game while shared domains allow data to be shared across all games sharing those respective domains
		// this.clan.privateDomain is the equivalent of the "private" string and is the default value if no domain is specified
		var matchDomain = this.clan.privateDomain;
		
		var osNotification = notification ? JSON.parse(notification) : null;
		
		this.clan.withGamer(this.gamerData).matches(matchDomain).invite(matchID, friendID, osNotification, function(error, result)
		{
			// If the operation went wrong for some reason
			if (error)
			{
				var errorMessage = "Match Invite error: " + error;
				ConsoleLog(errorMessage);
				self.MatchTextDisplay(bodyMatchInviteStatus, errorMessage);
			}
			// If the operation succeeded
			else
			{
				var resultMessage = "Match Invite -> " + JSON.stringify(result);
				ConsoleLog(resultMessage);
				self.MatchTextDisplay(bodyMatchInviteStatus, resultMessage);
			}
		});
	}
	// If no gamer is logged in, this feature is unavailable
	else
	{
		var errorMessage = "Match Invite error: Can't use match features without logged in gamer data";
		ConsoleLog(errorMessage);
		this.MatchTextDisplay(bodyMatchInviteStatus, errorMessage);
	}
}

// Dismiss match invitations
Sample.prototype.MatchDismiss = function(matchID)
{
	var self = this;
	var bodyMatchInviteStatus = document.getElementById("body-match-invite");
	
	if (this.gamerData)
	{
		// Domains are used to scope data
		// The private domain is specific to the current game while shared domains allow data to be shared across all games sharing those respective domains
		// this.clan.privateDomain is the equivalent of the "private" string and is the default value if no domain is specified
		var matchDomain = this.clan.privateDomain;
		
		this.clan.withGamer(this.gamerData).matches(matchDomain).dismiss(matchID, function(error, result)
		{
			// If the operation went wrong for some reason
			if (error)
			{
				var errorMessage = "Match Dismiss error: " + error;
				ConsoleLog(errorMessage);
				self.MatchTextDisplay(bodyMatchInviteStatus, errorMessage);
			}
			// If the operation succeeded
			else
			{
				var resultMessage = "Match Dismiss -> " + JSON.stringify(result);
				ConsoleLog(resultMessage);
				self.MatchTextDisplay(bodyMatchInviteStatus, resultMessage);
			}
		});
	}
	// If no gamer is logged in, this feature is unavailable
	else
	{
		var errorMessage = "Match Dismiss error: Can't use match features without logged in gamer data";
		ConsoleLog(errorMessage);
		this.MatchTextDisplay(bodyMatchInviteStatus, errorMessage);
	}
}

// Make a move in a match
Sample.prototype.MatchMove = function(matchID, lastEventID, move, notification)
{
	var self = this;
	var bodyMatchMoveStatus = document.getElementById("body-match-move");
	
	if (this.gamerData)
	{
		// Domains are used to scope data
		// The private domain is specific to the current game while shared domains allow data to be shared across all games sharing those respective domains
		// this.clan.privateDomain is the equivalent of the "private" string and is the default value if no domain is specified
		var matchDomain = this.clan.privateDomain;
		
		var moveData = JSON.parse(move);
		var osNotification = notification ? JSON.parse(notification) : null;
		
		this.clan.withGamer(this.gamerData).matches(matchDomain).move(matchID, lastEventID, moveData, osNotification, function(error, result)
		{
			// If the operation went wrong for some reason
			if (error)
			{
				var errorMessage = "Match Move error: " + error;
				ConsoleLog(errorMessage);
				self.MatchTextDisplay(bodyMatchMoveStatus, errorMessage);
			}
			// If the operation succeeded
			else
			{
				var resultMessage = "Match Move -> " + JSON.stringify(result);
				ConsoleLog(resultMessage);
				self.MatchTextDisplay(bodyMatchMoveStatus, resultMessage);
			}
		});
	}
	// If no gamer is logged in, this feature is unavailable
	else
	{
		var errorMessage = "Match Move error: Can't use match features without logged in gamer data";
		ConsoleLog(errorMessage);
		this.MatchTextDisplay(bodyMatchMoveStatus, errorMessage);
	}
}

// Draw an item from the shoe
Sample.prototype.MatchDraw = function(matchID, lastEventID, itemsCount, notification)
{
	var self = this;
	var bodyMatchMoveStatus = document.getElementById("body-match-move");
	
	if (this.gamerData)
	{
		// Domains are used to scope data
		// The private domain is specific to the current game while shared domains allow data to be shared across all games sharing those respective domains
		// this.clan.privateDomain is the equivalent of the "private" string and is the default value if no domain is specified
		var matchDomain = this.clan.privateDomain;
		
		var osNotification = notification ? JSON.parse(notification) : null;
		
		this.clan.withGamer(this.gamerData).matches(matchDomain).draw(matchID, lastEventID, itemsCount, osNotification, function(error, result)
		{
			// If the operation went wrong for some reason
			if (error)
			{
				var errorMessage = "Match Draw error: " + error;
				ConsoleLog(errorMessage);
				self.MatchTextDisplay(bodyMatchMoveStatus, errorMessage);
			}
			// If the operation succeeded
			else
			{
				var resultMessage = "Match Draw -> " + JSON.stringify(result);
				ConsoleLog(resultMessage);
				self.MatchTextDisplay(bodyMatchMoveStatus, resultMessage);
			}
		});
	}
	// If no gamer is logged in, this feature is unavailable
	else
	{
		var errorMessage = "Match Draw error: Can't use match features without logged in gamer data";
		ConsoleLog(errorMessage);
		this.MatchTextDisplay(bodyMatchMoveStatus, errorMessage);
	}
}

// Finish a match
Sample.prototype.MatchFinish = function(matchID, lastEventID, notification)
{
	var self = this;
	var bodyMatchFinishStatus = document.getElementById("body-match-finish");
	
	if (this.gamerData)
	{
		// Domains are used to scope data
		// The private domain is specific to the current game while shared domains allow data to be shared across all games sharing those respective domains
		// this.clan.privateDomain is the equivalent of the "private" string and is the default value if no domain is specified
		var matchDomain = this.clan.privateDomain;
		
		var osNotification = notification ? JSON.parse(notification) : null;
		
		this.clan.withGamer(this.gamerData).matches(matchDomain).finish(matchID, lastEventID, osNotification, function(error, result)
		{
			// If the operation went wrong for some reason
			if (error)
			{
				var errorMessage = "Match Finish error: " + error;
				ConsoleLog(errorMessage);
				self.MatchTextDisplay(bodyMatchFinishStatus, errorMessage);
			}
			// If the operation succeeded
			else
			{
				var resultMessage = "Match Finish -> " + JSON.stringify(result);
				ConsoleLog(resultMessage);
				self.MatchTextDisplay(bodyMatchFinishStatus, resultMessage);
			}
		});
	}
	// If no gamer is logged in, this feature is unavailable
	else
	{
		var errorMessage = "Match Finish error: Can't use match features without logged in gamer data";
		ConsoleLog(errorMessage);
		this.MatchTextDisplay(bodyMatchFinishStatus, errorMessage);
	}
}

// Delete a match
Sample.prototype.MatchDelete = function(matchID)
{
	var self = this;
	var bodyMatchFinishStatus = document.getElementById("body-match-finish");
	
	if (this.gamerData)
	{
		// Domains are used to scope data
		// The private domain is specific to the current game while shared domains allow data to be shared across all games sharing those respective domains
		// this.clan.privateDomain is the equivalent of the "private" string and is the default value if no domain is specified
		var matchDomain = this.clan.privateDomain;
		
		this.clan.withGamer(this.gamerData).matches(matchDomain).del(matchID, function(error, result)
		{
			// If the operation went wrong for some reason
			if (error)
			{
				var errorMessage = "Match Delete error: " + error;
				ConsoleLog(errorMessage);
				self.MatchTextDisplay(bodyMatchFinishStatus, errorMessage);
			}
			// If the operation succeeded
			else
			{
				var resultMessage = "Match Delete -> " + JSON.stringify(result);
				ConsoleLog(resultMessage);
				self.MatchTextDisplay(bodyMatchFinishStatus, resultMessage);
			}
		});
	}
	// If no gamer is logged in, this feature is unavailable
	else
	{
		var errorMessage = "Match Delete error: Can't use match features without logged in gamer data";
		ConsoleLog(errorMessage);
		this.MatchTextDisplay(bodyMatchFinishStatus, errorMessage);
	}
}

// Remove a match from indexed searches
Sample.prototype.MatchIndexDelete = function(matchID)
{
	var self = this;
	var bodyMatchFinishStatus = document.getElementById("body-match-finish");
	
	// Domains are used to scope data
	// The private domain is specific to the current game while shared domains allow data to be shared across all games sharing those respective domains
	// this.clan.privateDomain is the equivalent of the "private" string and is the default value if no domain is specified
	var matchDomain = this.clan.privateDomain;
	
	this.clan.indexes(matchDomain).del("Matches", matchID, function(error, result)
	{
		// If the operation went wrong for some reason
		if (error)
		{
			var errorMessage = "Match Index Delete error: " + error;
			ConsoleLog(errorMessage);
			self.MatchTextDisplay(bodyMatchFinishStatus, errorMessage);
		}
		// If the operation succeeded
		else
		{
			var resultMessage = "Match Index Delete -> " + JSON.stringify(result);
			ConsoleLog(resultMessage);
			self.MatchTextDisplay(bodyMatchFinishStatus, resultMessage);
		}
	});
}

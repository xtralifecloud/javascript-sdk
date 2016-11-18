// A helper to display VFS results as a text
Sample.prototype.VfsTextDisplay = function(container, text)
{
	if (container)
	{
		var finalText = "<p><b>" + text + "</b></p>";
		container.innerHTML = finalText;
	}
}

// A helper to display VFS key values as a table
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
		// Domains are used to scope data
		// The private domain is specific to the current game while shared domains allow data to be shared across all games sharing those respective domains
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
		// Domains are used to scope data
		// The private domain is specific to the current game while shared domains allow data to be shared across all games sharing those respective domains
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
		// Domains are used to scope data
		// The private domain is specific to the current game while shared domains allow data to be shared across all games sharing those respective domains
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
	
	// Domains are used to scope data
	// The private domain is specific to the current game while shared domains allow data to be shared across all games sharing those respective domains
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

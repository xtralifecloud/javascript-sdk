// A helper to display leaderboard results as a text
Sample.prototype.LeaderboardTextDisplay = function(container, text)
{
	if (container)
	{
		var finalText = "<p><b>" + text + "</b></p>";
		container.innerHTML = finalText;
	}
}

// A helper to display leaderboard scores as a table
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
			finalTable += "<tr><td colspan=\"2\"><p>(No score found in boards)</p></td></tr>";
		
		finalTable += "</table>";
		container.innerHTML = finalTable;
	}
}

// A helper to display leaderboard scores as a paged table
Sample.prototype.LeaderboardTablePagedDisplay = function(container, boardName, boardScores, scoresAmount)
{
	if (container)
	{
		var finalTable = "<table><tr><td class=\"col_a title\"><b>Board:<br />" + boardName + "</b></td><td class=\"col_b title\"><b>Score(s) Data (Page " + boardScores.page + " / " + boardScores.maxpage + ", " + scoresAmount + " score(s) max per page)</b></td></tr>";
		var scoresNumber = 0;
		
		while (scoresNumber < boardScores.scores.length)
		{
			finalTable += "<tr><td class=\"col_a\"><p>Rank #" + (boardScores.rankOfFirst + scoresNumber) + "<br />Gamer Pseudo: " + boardScores.scores[scoresNumber].profile.displayName + "</p></td><td class=\"col_b\"><p>Score: " + boardScores.scores[scoresNumber].score.score + ", Post Date: " + boardScores.scores[scoresNumber].score.timestamp + ", Description: " + boardScores.scores[scoresNumber].score.info + "</p></td></tr>";
			++scoresNumber;
		}
		
		if (scoresNumber == 0)
			finalTable += "<tr><td colspan=\"2\"><p>(No score found in board)</p></td></tr>";
		
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
		// Domains are used to scope data
		// The private domain is specific to the current game while shared domains allow data to be shared across all games sharing those respective domains
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
		// Domains are used to scope data
		// The private domain is specific to the current game while shared domains allow data to be shared across all games sharing those respective domains
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
		// Domains are used to scope data
		// The private domain is specific to the current game while shared domains allow data to be shared across all games sharing those respective domains
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

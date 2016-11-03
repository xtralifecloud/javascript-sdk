<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		
		<title>Leaderboard features</title>
		
		<link href="img/favicon.ico" rel="icon" type="image/x-icon" />
		
		<link href="css/reset.css" rel="stylesheet" type="text/css" />
		<link href="css/style.css" rel="stylesheet" type="text/css" />
		<link href="css/header.css" rel="stylesheet" type="text/css" />
		<link href="css/leaderboard.css" rel="stylesheet" type="text/css" />
		<link href="css/console.css" rel="stylesheet" type="text/css" />
		<link href="css/footer.css" rel="stylesheet" type="text/css" />
		
		<script src="js/bundle.min.js" type="text/javascript"></script>
		<script src="js/cloudbuilder.js" type="text/javascript"></script>
		<script src="js/storagemanager.js" type="text/javascript"></script>
		<script src="js/console.js" type="text/javascript"></script>
	</head>
	
	<body>
		<?php $currentPage = "leaderboard"; include("header.php"); ?>
		<div class="content">
			<h1>Leaderboard features</h1>
			<p>First of all, to use most of the SDK features you'll need to be <a href="./login.php">logged in</a> as a gamer... Don't forget to check the console for actions feedback!</p>
			<table class="content_table leaderboard_features">
				<tr>
					<td>
						<fieldset>
							<legend>A - Private leaderboards</legend>
							<p>Each gamer is allowed to post scores to a specific board. Those boards are automatically created if they don't exist yet when a gamer scores for the first time in them, and they can be sorted with the higher or the lower score as the best one. On the "private" domain, a leaderboard is relative to the current game, then a given leaderboard name would lead to different boards in different games.</p>
							<table class="leaderboard_step">
								<tr>
									<td>
										<button type="button" onclick="cloudBuilder.LeaderboardSet(GetLeaderboardSetOrder(), document.getElementById('leaderboardSetBoard').value, document.getElementById('leaderboardSetScoreValue').value, document.getElementById('leaderboardSetScoreInfo').value)">Post New Score -></button>
									</td>
									<td class="radios">
										<input type="radio" name="leaderboardSetOrder" value="lowtohigh" />LowToHigh
										<br />
										<input type="radio" name="leaderboardSetOrder" value="hightolow" checked="checked" />HighToLow
									</td>
									<td>
										<input type="text" id="leaderboardSetBoard" name="leaderboardSetBoard" value="[Board Name]" />
									</td>
									<td>
										<input type="text" id="leaderboardSetScoreValue" name="leaderboardSetScoreValue" value="[Score Value]" />
										<br />
										<input type="text" id="leaderboardSetScoreInfo" name="leaderboardSetScoreInfo" value="[Score Description]" />
									</td>
								</tr>
								<tr>
									<td colspan="4">
										<p class="leaderboard_note"><u>Note for Post:</u> You may create monthly based boards by naming them after the post date for instance.
										<br />(e.g. SurvivalBoard-2016-06, SurvivalBoard-2016-07, and so on...)
										<br />The sort order (lowtohigh or hightolow) is used to establish if the posted score is better
										<br />than the previous gamer's best one on this board and should always be the same for consistency logic.
										<br />The score description is a short text or a Json object you may want to attach to the posted score.
										<br />(e.g. {"Level":15, "UsedBoosters":0})</p>
									</td>
								</tr>
								<tr>
									<td colspan="4" class="large_buttons">
										<button type="button" onclick="cloudBuilder.LeaderboardGet()">Get All Gamer's Best Scores</button>
									</td>
								</tr>
								<tr>
									<td colspan="4">
										<p class="leaderboard_note"><u>Note for Get:</u> The gamer's best score for each board in which he posted at least one score will be returned.</p>
									</td>
								</tr>
								<tr>
									<td>
										<button type="button" onclick="cloudBuilder.LeaderboardGetPaged(document.getElementById('leaderboardGetPagedBoard').value, document.getElementById('leaderboardGetPagedPage').value, document.getElementById('leaderboardGetPagedCount').value)">Get Paged Scores -></button>
									</td>
									<td>
										<input type="text" id="leaderboardGetPagedBoard" name="leaderboardGetPagedBoard" value="[Board Name]" />
									</td>
									<td>
										<input type="text" id="leaderboardGetPagedPage" name="leaderboardGetPagedPage" value="[Page Number]" />
									</td>
									<td>
										<input type="text" id="leaderboardGetPagedCount" name="leaderboardGetPagedCount" value="[Scores Amount]" />
									</td>
								</tr>
								<tr>
									<td colspan="4">
										<p class="leaderboard_note"><u>Note for Get Paged:</u> The first page is number 1 (not 0).</p>
									</td>
								</tr>
							</table>
							<span id="body-leaderboard"></span>
						</fieldset>
					</td>
				</tr>
				<tr>
					<td>
						<fieldset>
							<legend>B - Shared leaderboards</legend>
							<p>Shared domains allow the sharing of the same leaderboards across multiple games (all sharing the same domain). Shared domains need to be set on your Front Office. However, we won't show this feature here as we have only one sample webapp (but it works strictly the same way as for the private domain).</p>
						</fieldset>
					</td>
				</tr>
			</table>
			<?php include("console.php"); ?>
		</div>
		<?php include("footer.php"); ?>
		
		<script type="text/javascript">
		  <!--
			CheckCredentials();
			
			var storageManager = new StorageManager();
			var cloudBuilder = new CloudBuilder(storageManager);
			
			cloudBuilder.LoggedInCheck();
			
			function GetLeaderboardSetOrder()
			{
				var radios = document.getElementsByName("leaderboardSetOrder");
				
				for (var item = 0 ; item < radios.length; ++item)
					if (radios[item].checked)
						return radios[item].value;
			}
		  //-->
		</script>
	</body>
</html>

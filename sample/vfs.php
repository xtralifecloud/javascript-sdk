<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		
		<title>VFS (Virtual File System) features</title>
		
		<link href="img/favicon.ico" rel="icon" type="image/x-icon" />
		
		<link href="css/reset.css" rel="stylesheet" type="text/css" />
		<link href="css/style.css" rel="stylesheet" type="text/css" />
		<link href="css/header.css" rel="stylesheet" type="text/css" />
		<link href="css/vfs.css" rel="stylesheet" type="text/css" />
		<link href="css/console.css" rel="stylesheet" type="text/css" />
		<link href="css/footer.css" rel="stylesheet" type="text/css" />
		
		<script src="js/bundle.min.js" type="text/javascript"></script>
		<script src="js/cloudbuilder.js" type="text/javascript"></script>
		<script src="js/storagemanager.js" type="text/javascript"></script>
		<script src="js/console.js" type="text/javascript"></script>
	</head>
	
	<body>
		<?php $currentPage = "vfs"; include("header.php"); ?>
		<div class="content">
			<h1>VFS (Virtual File System) features</h1>
			<p>First of all, to use most of the SDK features you'll need to be <a href="./login.php">logged in</a> as a gamer... Don't forget to check the console for actions feedback!</p>
			<table class="content_table vfs_features">
				<tr>
					<td>
						<fieldset>
							<legend>A - Gamer's private VFS Key / Values (needs to be logged in)</legend>
							<p>Each gamer is allowed to create/set, get and delete his own key/value pairs. Those pairs are perfect to store all kind of data you want to associate to your gamers (e.g. gamer's profile, last login date, preferences, number of lives...). On the "private" domain, a key value is relative to the current gamer and in the current game, then for a given gamer the same key will have different values in different games.</p>
							<table class="vfs_step">
								<tr>
									<td>
										<button type="button" onclick="cloudBuilder.GamerVfsSet(document.getElementById('gamerVfsSetKey').value, document.getElementById('gamerVfsSetValue').value)">Create / Set Key Value -></button>
									</td>
									<td>
										<input type="text" id="gamerVfsSetKey" name="gamerVfsSetKey" value="[VFS Key]" />
									</td>
									<td>
										<input type="text" id="gamerVfsSetValue" name="gamerVfsSetValue" value="[VFS Value]" />
									</td>
								</tr>
								<tr>
									<td colspan="3">
										<p class="vfs_note"><u>Note for Create / Set:</u> The value field may be of any standard type or under Json object format.
										<br />Only string format will be handled here because we get the input value which is always a string.
										<br />(e.g. Key: Profile / Value: {"Name":"John", "Surname":"Doe", "Age":21})
										<br />(e.g. Key: LastSearch / Value: Cookies)</p>
									</td>
								</tr>
								<tr>
									<td>
										<button type="button" onclick="cloudBuilder.GamerVfsGet(document.getElementById('gamerVfsGetKey').value)">Get Key(s) Value(s) -></button>
									</td>
									<td>
										<input type="text" id="gamerVfsGetKey" name="gamerVfsGetKey" value="[VFS Key]" />
									</td>
									<td>
										
									</td>
								</tr>
								<tr>
									<td colspan="3">
										<p class="vfs_note"><u>Note for Get:</u> An empty key field will get all existing keys instead of a specified one.</p>
									</td>
								</tr>
								<tr>
									<td>
										<button type="button" onclick="cloudBuilder.GamerVfsDelete(document.getElementById('gamerVfsDeleteKey').value)">Delete Key(s) -></button>
									</td>
									<td>
										<input type="text" id="gamerVfsDeleteKey" name="gamerVfsDeleteKey" value="[VFS Key]" />
									</td>
									<td>
										
									</td>
								</tr>
								<tr>
									<td colspan="3">
										<p class="vfs_note"><u>Note for Delete:</u> An empty key field will delete all existing keys instead of a specified one, so <b>double check this!</b></p>
									</td>
								</tr>
							</table>
							<span id="body-gamer-vfs"></span>
						</fieldset>
					</td>
				</tr>
				<tr>
					<td>
						<fieldset>
							<legend>B - Game's private VFS Key / Values (doesn't need to be logged in)</legend>
							<p>Each game allows to get its own key/value pairs. Those pairs are perfect to store all kind of data you want to associate to your games (e.g. game parameters, connection rewards, maximum allowed number of lives...). On the "private" domain, a key value is relative to the current game.</p>
							<table class="vfs_step">
								<tr>
									<td>
										
									</td>
									<td>
										<button type="button" onclick="cloudBuilder.GameVfsGet(document.getElementById('gameVfsGetKey').value)">Get Key(s) Value(s) -></button>
									</td>
									<td>
										<input type="text" id="gameVfsGetKey" name="gameVfsGetKey" value="[VFS Key]" />
									</td>
									<td>
										
									</td>
								</tr>
								<tr>
									<td colspan="4">
										<p class="vfs_note"><u>Note for Get:</u> Gamers are not allowed to set or delete game keys<br />
										for obvious security reasons, so you need to do it on your Front Office.</p>
									</td>
								</tr>
							</table>
							<span id="body-game-vfs"></span>
						</fieldset>
					</td>
				</tr>
				<tr>
					<td>
						<fieldset>
							<legend>C - Gamer's and Game's shared VFS Key / Values</legend>
							<p>Shared domains allow the sharing of the same key values across multiple games (all sharing the same domain), or to set a global game key value available between all those games. Shared domains need to be set on your Front Office. However, we won't show this feature here as we have only one sample webapp (but it works strictly the same way as for the private domain).</p>
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
		  //-->
		</script>
	</body>
</html>

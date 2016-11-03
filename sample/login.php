<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		
		<title>Login features</title>
		
		<link href="img/favicon.ico" rel="icon" type="image/x-icon" />
		
		<link href="css/reset.css" rel="stylesheet" type="text/css" />
		<link href="css/style.css" rel="stylesheet" type="text/css" />
		<link href="css/header.css" rel="stylesheet" type="text/css" />
		<link href="css/login.css" rel="stylesheet" type="text/css" />
		<link href="css/console.css" rel="stylesheet" type="text/css" />
		<link href="css/footer.css" rel="stylesheet" type="text/css" />
		
		<script src="js/bundle.min.js" type="text/javascript"></script>
		<script src="js/cloudbuilder.js" type="text/javascript"></script>
		<script src="js/storagemanager.js" type="text/javascript"></script>
		<script src="js/facebook.js" type="text/javascript"></script>
		<script src="js/console.js" type="text/javascript"></script>
	</head>
	
	<body>
		<?php $currentPage = "login"; include("header.php"); ?>
		<div class="content">
			<h1>Login features</h1>
			<p>First of all, to use most of the SDK features you'll need to be logged in as a gamer... Don't forget to check the console for actions feedback!</p>
			<table class="content_table login_features">
				<tr>
					<td>
						<fieldset>
							<legend>Step 1 - Log in to CotC with your Facebook account or a new anonymous one</legend>
							<p>You should then store the credentials (check console for gamer_id and gamer_secret) obtained from the Json response to automatically log in again later as the same gamer.</p>
							<table class="login_step">
								<tr>
									<td>
										<button type="button" onclick="cloudBuilder.LoginAnonymously(cloudBuilder.LoginDone)"><img src="img/logomini-xtralife.png" alt="[LogoMini XtraLife]" />New Anonymous Login</button>
										<button onclick="cloudBuilder.LoginFacebook(cloudBuilder.LoginDone)"><img src="img/logomini-facebook.png" alt="[LogoMini Facebook]" />Login with Facebook</button>
									</td>
									<td>
										<button type="button" onclick="cloudBuilder.LoggedInCheck()">Check CotC Login Status</button>
									</td>
									<td>
										<button type="button" onclick="cloudBuilder.Logout()">Logout (Delete Gamer Cache)</button>
									</td>
								</tr>
							</table>
						</fieldset>
					</td>
				</tr>
				<tr>
					<td>
						<fieldset>
							<legend>Step 2 - For next CotC logins, use stored gamer credentials</legend>
							<p>If previous login credentials are stored, use them to log in again as the same gamer and recover his data. This way, you may auto-login the gamer with stored credentials and avoid to ask the gamer to manually login again.</p>
							<table class="login_step">
								<tr>
									<td>
										<button type="button" onclick="cloudBuilder.LoginWithCredentials(document.getElementById('gamerId').value, document.getElementById('gamerSecret').value, cloudBuilder.LoginDone)">Login With Credentials -></button>
									</td>
									<td>
										<input type="text" id="gamerId" name="gamerId" value="[Gamer ID]" />
									</td>
									<td>
										<input type="text" id="gamerSecret" name="gamerSecret" value="[Gamer Secret]" />
									</td>
								</tr>
							</table>
						</fieldset>
					</td>
				</tr>
				<tr>
					<td>
						<fieldset>
							<legend>Here you can check your current CotC login status</legend>
							<b><p id="body-login"></p></b>
							<p class="login_status">(Note: You may be logged into Facebook and Facebook CotC's app and still be logged out of the CotC SDK)</p>
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
